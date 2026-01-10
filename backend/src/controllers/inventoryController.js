const asyncHandler = require('express-async-handler');
const Receipt = require('../models/Receipt');
const DeliveryOrder = require('../models/DeliveryOrder');
const StockTransfer = require('../models/StockTransfer');
const StockAdjustment = require('../models/StockAdjustment');
const Stock = require('../models/Stock');
const StockLedger = require('../models/StockLedger');

// Utility to update stock and ledger
const updateStockAndLedger = async (product, warehouse, location, quantity, type, docId, docModel, user) => {
    // 1. Update Stock
    let stock = await Stock.findOne({ product, warehouse, location });

    if (!stock) {
        if (quantity < 0) {
            throw new Error(`Insufficient stock for product ${product} in warehouse ${warehouse}`);
        }
        stock = await Stock.create({ product, warehouse, location, quantity: 0 });
    }

    if (stock.quantity + quantity < 0) {
        throw new Error(`Insufficient stock. Current: ${stock.quantity}, Requested: ${Math.abs(quantity)}`);
    }

    stock.quantity += quantity;
    await stock.save();

    // 2. Create Ledger Entry
    await StockLedger.create({
        product,
        warehouse,
        location,
        quantity,
        type,
        referenceDocument: docId,
        documentModel: docModel,
        performedBy: user,
    });
};

// @desc    Create Receipt (Stock In)
// @route   POST /api/inventory/receipts
// @access  Private (Admin/Manager)
const createReceipt = asyncHandler(async (req, res) => {
    const { referenceNumber, warehouse, items, notes } = req.body;

    // Validation (Check if Ref exists)
    const exists = await Receipt.findOne({ referenceNumber });
    if (exists) {
        res.status(400);
        throw new Error('Reference number already exists');
    }

    const receipt = await Receipt.create({
        referenceNumber,
        warehouse,
        items,
        notes,
        createdBy: req.user._id,
        status: 'Completed', // Auto-complete for MVP simplification
    });

    // Process Stock Updates
    for (const item of items) {
        await updateStockAndLedger(
            item.product,
            warehouse,
            null, // Default location null for simple receipt if not specified
            item.quantity,
            'Receipt',
            receipt._id,
            'Receipt',
            req.user._id
        );
    }

    res.status(201).json(receipt);
});

// @desc    Create Delivery Order (Stock Out)
// @route   POST /api/inventory/deliveries
// @access  Private (Admin/Manager)
const createDeliveryOrder = asyncHandler(async (req, res) => {
    const { referenceNumber, warehouse, customer, items, notes } = req.body;

    const exists = await DeliveryOrder.findOne({ referenceNumber });
    if (exists) {
        res.status(400);
        throw new Error('Reference number already exists');
    }

    // Pre-check stock availability
    for (const item of items) {
        const stock = await Stock.findOne({ product: item.product, warehouse });
        if (!stock || stock.quantity < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for product ID: ${item.product}`);
        }
    }

    const deliveryOrder = await DeliveryOrder.create({
        referenceNumber,
        warehouse,
        customer,
        items,
        notes,
        createdBy: req.user._id,
        status: 'Shipped', // Auto-ship for MVP
    });

    for (const item of items) {
        // Find specific stock entry (location null for now effectively aggregation)
        // In real app, might need to pick specific location or iterate
        await updateStockAndLedger(
            item.product,
            warehouse,
            null,
            -item.quantity,
            'Delivery',
            deliveryOrder._id,
            'DeliveryOrder',
            req.user._id
        );
    }

    res.status(201).json(deliveryOrder);
});

// @desc    Create Stock Adjustment
// @route   POST /api/inventory/adjustments
// @access  Private (Admin/Manager)
const createAdjustment = asyncHandler(async (req, res) => {
    const { referenceNumber, warehouse, items, reason, type } = req.body;

    // type: 'Increase' or 'Decrease'

    const adjustment = await StockAdjustment.create({
        referenceNumber,
        warehouse,
        items,
        reason,
        type,
        createdBy: req.user._id,
        status: 'Approved',
    });

    for (const item of items) {
        const qty = type === 'Increase' ? item.quantity : -item.quantity;
        await updateStockAndLedger(
            item.product,
            warehouse,
            null,
            qty,
            'Adjustment',
            adjustment._id,
            'StockAdjustment',
            req.user._id
        );
    }

    res.status(201).json(adjustment);
});

// @desc    Get Stock Balance
// @route   GET /api/inventory/stock
// @access  Private
const getStockBalance = asyncHandler(async (req, res) => {
    const keyword = {};
    if (req.query.warehouse) keyword.warehouse = req.query.warehouse;
    if (req.query.product) keyword.product = req.query.product;

    const stocks = await Stock.find(keyword)
        .populate('product', 'name sku')
        .populate('warehouse', 'name')
        .populate('location', 'name');

    res.json(stocks);
});


// @desc    Get Stock Ledger (History)
// @route   GET /api/inventory/history
// @access  Private
const getStockHistory = asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = {};
    if (req.query.product) keyword.product = req.query.product;
    if (req.query.warehouse) keyword.warehouse = req.query.warehouse;

    const count = await StockLedger.countDocuments(keyword);
    const history = await StockLedger.find(keyword)
        .populate('product', 'name sku')
        .populate('warehouse', 'name')
        .populate('performedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ history, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get Dashboard Stats
// @route   GET /api/inventory/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalProducts = await require('../models/Product').countDocuments({});
    const totalWarehouses = await require('../models/Warehouse').countDocuments({});

    // Aggregate total stock across all entries
    const stockAggregation = await require('../models/Stock').aggregate([
        {
            $group: {
                _id: null,
                totalStock: { $sum: '$quantity' }
            }
        }
    ]);
    const totalStock = stockAggregation.length > 0 ? stockAggregation[0].totalStock : 0;

    const lowStockCount = await require('../models/Product').countDocuments({
        // This is tricky without lookup, but for now assuming ReorderLevel is static
        // Ideally we check Stock vs Product.ReorderLevel. 
        // For MVP, just returning count of products. 
        // Correct implementation requires aggregation or separate check.
        // We will just return 0 or implement a simple check if possible.
        // Let's just return totalProducts and basic counts for now.
    });

    res.json({
        totalProducts,
        totalWarehouses,
        totalStock,
        lowStockCount: 0 // Placeholder
    });
});

module.exports = {
    createReceipt,
    createDeliveryOrder,
    createAdjustment,
    getStockBalance,
    getStockHistory,
    getDashboardStats
};

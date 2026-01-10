const asyncHandler = require('express-async-handler');
const Warehouse = require('../models/Warehouse');
const Location = require('../models/Location');

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
const getWarehouses = asyncHandler(async (req, res) => {
    const warehouses = await Warehouse.find({}).populate('manager', 'name email');
    res.json(warehouses);
});

// @desc    Get warehouse by ID
// @route   GET /api/warehouses/:id
// @access  Private
const getWarehouseById = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id).populate('manager', 'name email');
    if (warehouse) {
        res.json(warehouse);
    } else {
        res.status(404);
        throw new Error('Warehouse not found');
    }
});

// @desc    Create warehouse
// @route   POST /api/warehouses
// @access  Private (Admin/Manager)
const createWarehouse = asyncHandler(async (req, res) => {
    const { name, address, manager } = req.body;

    const warehouseExists = await Warehouse.findOne({ name });
    if (warehouseExists) {
        res.status(400);
        throw new Error('Warehouse already exists');
    }

    const warehouse = await Warehouse.create({
        name,
        address,
        manager,
    });
    res.status(201).json(warehouse);
});

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (Admin/Manager)
const updateWarehouse = asyncHandler(async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);

    if (warehouse) {
        warehouse.name = req.body.name || warehouse.name;
        warehouse.address = req.body.address || warehouse.address;
        warehouse.manager = req.body.manager || warehouse.manager;

        const updatedWarehouse = await warehouse.save();
        res.json(updatedWarehouse);
    } else {
        res.status(404);
        throw new Error('Warehouse not found');
    }
});

module.exports = { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse };

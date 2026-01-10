const express = require('express');
const router = express.Router();
const {
    createReceipt,
    createDeliveryOrder,
    createAdjustment,
    getStockBalance,
    getStockHistory,
    getDashboardStats
} = require('../controllers/inventoryController');
const { protect, manager } = require('../middleware/authMiddleware');

router.post('/receipts', protect, manager, createReceipt);
router.post('/deliveries', protect, manager, createDeliveryOrder);
router.post('/adjustments', protect, manager, createAdjustment);
router.get('/stock', protect, getStockBalance);
router.get('/history', protect, getStockHistory);
router.get('/stats', protect, getDashboardStats);

module.exports = router;

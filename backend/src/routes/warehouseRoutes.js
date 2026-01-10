const express = require('express');
const router = express.Router();
const {
    getWarehouses,
    createWarehouse,
    getWarehouseById,
    updateWarehouse,
} = require('../controllers/warehouseController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getWarehouses)
    .post(protect, manager, createWarehouse);

router.route('/:id')
    .get(protect, getWarehouseById)
    .put(protect, manager, updateWarehouse);

module.exports = router;

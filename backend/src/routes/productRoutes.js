const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, manager, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getProducts)
    .post(protect, manager, createProduct);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, manager, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;

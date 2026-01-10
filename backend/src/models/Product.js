const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    uom: {
        type: String, // Unit of Measure
        required: true,
    },
    reorderLevel: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    }
}, {
    timestamps: true,
});

// Ensure unique stock entry per product/location(or warehouse if loc is null)
stockSchema.index({ product: 1, warehouse: 1, location: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);

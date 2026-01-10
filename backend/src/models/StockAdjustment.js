const mongoose = require('mongoose');

const stockAdjustmentSchema = new mongoose.Schema({
    referenceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Increase', 'Decrease'],
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('StockAdjustment', stockAdjustmentSchema);

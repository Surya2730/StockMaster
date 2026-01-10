const mongoose = require('mongoose');

const stockTransferSchema = new mongoose.Schema({
    referenceNumber: {
        type: String,
        required: true,
        unique: true,
    },
    sourceWarehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    sourceLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
    },
    destinationWarehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    },
    destinationLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
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
        enum: ['Pending', 'Completed', 'Cancelled'],
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

module.exports = mongoose.model('StockTransfer', stockTransferSchema);

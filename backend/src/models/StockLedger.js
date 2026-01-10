const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema({
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
        type: Number, // Positive for addition, Negative for deduction
        required: true,
    },
    type: {
        type: String,
        enum: ['Receipt', 'Delivery', 'Transfer', 'Adjustment', 'Initial'],
        required: true,
    },
    referenceDocument: {
        type: mongoose.Schema.Types.ObjectId, // ID of Receipt, DO, Transfer, etc.
        required: false,
        refPath: 'documentModel'
    },
    documentModel: {
        type: String,
        required: false,
        enum: ['Receipt', 'DeliveryOrder', 'StockTransfer', 'StockAdjustment']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('StockLedger', stockLedgerSchema);

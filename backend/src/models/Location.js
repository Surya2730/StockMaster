const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "A1-Shelf2", "Docking Area"
        required: true,
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Warehouse',
        required: true,
    }
}, {
    timestamps: true,
});

// Compound index to ensure unique location names within a warehouse
locationSchema.index({ name: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);

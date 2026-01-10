const asyncHandler = require('express-async-handler');
const Location = require('../models/Location');

// @desc    Get locations for a warehouse
// @route   GET /api/locations?warehouse=ID
// @access  Private
const getLocations = asyncHandler(async (req, res) => {
    const keyword = req.query.warehouse ? { warehouse: req.query.warehouse } : {};
    const locations = await Location.find({ ...keyword }).populate('warehouse', 'name');
    res.json(locations);
});

// @desc    Create location
// @route   POST /api/locations
// @access  Private (Admin/Manager)
const createLocation = asyncHandler(async (req, res) => {
    const { name, warehouse } = req.body;

    const locationExists = await Location.findOne({ name, warehouse });
    if (locationExists) {
        res.status(400);
        throw new Error('Location already exists in this warehouse');
    }

    const location = await Location.create({
        name,
        warehouse,
    });
    res.status(201).json(location);
});

module.exports = { getLocations, createLocation };

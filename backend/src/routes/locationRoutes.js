const express = require('express');
const router = express.Router();
const { getLocations, createLocation } = require('../controllers/locationController');
const { protect, manager } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getLocations)
    .post(protect, manager, createLocation);

module.exports = router;

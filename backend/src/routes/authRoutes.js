const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleAuth);
router.get('/profile', protect, getUserProfile);

module.exports = router;

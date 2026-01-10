const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (Initial admin setup) or Protected (Admin only)
// Note: For MVP, allowing public registration for simplicity, or restricted.
// Changing to: Check if it's the FIRST user -> make Admin. Else -> Staff (or require admin token).
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // First user is Admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    const finalRole = isFirstUser ? 'Admin' : (role || 'Staff');

    const user = await User.create({
        name,
        email,
        password,
        role: finalRole,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
    const { token } = req.body;

    console.log('--- Google Auth Trace ---');
    console.log('Token received, starting verification...');

    let ticket;
    try {
        ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (verifyErr) {
        console.error('Google Token Verification Error:', verifyErr.message);
        res.status(401);
        throw new Error('Google token verification failed: ' + verifyErr.message);
    }

    const { name, email, picture, sub } = ticket.getPayload();
    console.log(`Payload Extracted: ${email} (${name})`);

    let user;
    try {
        user = await User.findOne({ email });
        if (user) {
            console.log('Existing user found in DB:', user.email, 'Role:', user.role);
            if (!user.googleId) {
                console.log('Linking Google ID to existing email account...');
                user.googleId = sub;
                user.avatar = picture;
                await user.save();
                console.log('Google ID linked successfully.');
            }
        } else {
            console.log('No user found with this email. Creating new account...');
            user = await User.create({
                name,
                email,
                googleId: sub,
                avatar: picture,
                role: 'Staff',
            });
            console.log('New Google user created successfully.');
        }
    } catch (dbErr) {
        console.error('Database Operation Failed during Google Auth:', dbErr);
        res.status(500);
        throw new Error('Database error during Google Sign-In: ' + dbErr.message);
    }

    if (user) {
        console.log('Google Auth completed successfully for:', user.email);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user._id),
        });
    } else {
        console.error('Logic error: User object is null at end of googleAuth');
        res.status(500);
        throw new Error('Internal logic error during Google Sign-In');
    }
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    googleAuth
};

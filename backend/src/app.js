const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan'); // You might want to install morgan for logging, or custom logger
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

console.log('--- System Config ---');
console.log('Port:', process.env.PORT);
console.log('Database:', process.env.MONGO_URI ? process.env.MONGO_URI.split('@').pop() : 'NOT SET');
console.log('Google Client ID Loaded:', process.env.GOOGLE_CLIENT_ID ? 'YES (Ends with ' + process.env.GOOGLE_CLIENT_ID.slice(-10) + ')' : 'NO');
console.log('---------------------');

// Database Connection
connectDB();

// Basic Layout
app.get('/', (req, res) => {
    res.send('StockMaster API is running...');
});

// Routes (to be imported)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/warehouses', require('./routes/warehouseRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;

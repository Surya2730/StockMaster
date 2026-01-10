const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Warehouse = require('./src/models/Warehouse');
const Location = require('./src/models/Location');
const Stock = require('./src/models/Stock');
const StockLedger = require('./src/models/StockLedger');
const Receipt = require('./src/models/Receipt');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        console.log('Clearing existing data...');
        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Warehouse.deleteMany();
        await Location.deleteMany();
        await Stock.deleteMany();
        await StockLedger.deleteMany();
        await Receipt.deleteMany();
        await require('./src/models/DeliveryOrder').deleteMany();
        await require('./src/models/StockTransfer').deleteMany();
        await require('./src/models/StockAdjustment').deleteMany();

        console.log('Creating Users...');
        // Create Users
        const users = await User.create([
            { name: 'Suryaselvam', email: 'suryaselvam.219@gmail.com', password: 'Karthi$2730', role: 'Admin' },
            { name: 'John Manager', email: 'manager@example.com', password: 'password123', role: 'Manager' },
            { name: 'Jane Staff', email: 'staff@example.com', password: 'password123', role: 'Staff' },
        ]);
        const admin = users[0]._id;
        const manager = users[1]._id;

        console.log('Creating Warehouses...');
        // Create Warehouses
        const warehouses = await Warehouse.create([
            { name: 'Central Warehouse', address: '123 Main St, New York', manager: manager },
            { name: 'West Coast Dist', address: '456 Ocean Dr, California', manager: manager },
        ]);

        console.log('Creating Locations...');
        // Create Locations
        const locations = await Location.create([
            { name: 'Zone A - Electronics', warehouse: warehouses[0]._id },
            { name: 'Zone B - Furniture', warehouse: warehouses[0]._id },
            { name: 'Dock Loading', warehouse: warehouses[1]._id },
        ]);

        console.log('Creating Products...');
        // Create Products
        const products = await Product.create([
            { name: 'Gaming Laptop', sku: 'LAP-001', category: 'Electronics', uom: 'Unit', reorderLevel: 5, description: 'High performance gaming laptop' },
            { name: 'Wireless Mouse', sku: 'ACC-002', category: 'Electronics', uom: 'Unit', reorderLevel: 20, description: 'Ergonomic wireless mouse' },
            { name: 'Office Chair', sku: 'FUR-003', category: 'Furniture', uom: 'Unit', reorderLevel: 10, description: 'Mesh back office chair' },
            { name: 'Standing Desk', sku: 'FUR-004', category: 'Furniture', uom: 'Unit', reorderLevel: 5, description: 'Electric standing desk' },
            { name: 'Monitor 27"', sku: 'MON-005', category: 'Electronics', uom: 'Unit', reorderLevel: 8, description: '4K IPS Monitor' },
        ]);

        console.log('Creating Initial Stock (Receipts)...');
        // Create Initial Stock via Logic (Simulating Receipt)
        // We can manually insert stock but better to simulate event
        // For simplicity in seeder, we will direct insert Stock and Ledger to have history

        const initialStock = [
            { product: products[0]._id, warehouse: warehouses[0]._id, location: locations[0]._id, qty: 50 },
            { product: products[1]._id, warehouse: warehouses[0]._id, location: locations[0]._id, qty: 200 },
            { product: products[2]._id, warehouse: warehouses[1]._id, location: locations[2]._id, qty: 30 },
            { product: products[4]._id, warehouse: warehouses[0]._id, location: locations[0]._id, qty: 75 },
        ];

        for (const item of initialStock) {
            // Create Stock
            await Stock.create({
                product: item.product,
                warehouse: item.warehouse,
                location: item.location,
                quantity: item.qty
            });

            // Create Ledger
            await StockLedger.create({
                product: item.product,
                warehouse: item.warehouse,
                location: item.location,
                quantity: item.qty,
                type: 'Initial',
                performedBy: admin,
                documentModel: 'Receipt', // loose ref
            });
        }

        console.log('Data Imported Successfully!');
        console.log('Admin Email: suryaselvam.219@gmail.com');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();

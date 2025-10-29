// MongoDB Configuration (Optional - using in-memory storage for demo)
// If you want to use MongoDB, install mongoose and uncomment below

/*
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/transacthub', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
*/

// For this demo, we're using in-memory storage
// This simulates a database without requiring MongoDB installation

const inMemoryDB = {
  users: [],
  transactions: []
};

const connectDB = async () => {
  console.log('✅ Using in-memory database (no MongoDB required)');
  
  // Initialize with demo users
  inMemoryDB.users = [
    {
      _id: 'user1',
      email: 'user1@bank.com',
      password: '$2a$10$xmu.tQhS4kB9Z9xFQGzWfuyYVjxt6W4fGEYeW6asZSIzsZ1zdESg6', // password123
      accountNumber: 'ACC1000001',
      balance: 10000,
      role: 'user',
      createdAt: new Date()
    },
    {
      _id: 'user2',
      email: 'user2@bank.com',
      password: '$2a$10$xmu.tQhS4kB9Z9xFQGzWfuyYVjxt6W4fGEYeW6asZSIzsZ1zdESg6', // password123
      accountNumber: 'ACC1000002',
      balance: 5000,
      role: 'user',
      createdAt: new Date()
    },
    {
      _id: 'admin',
      email: 'admin@bank.com',
      password: '$2a$10$XjPej99v3.8VXZ9VNnQ9meBXvXEPX1m0dNNge5mzQqkDwheGueuQG', // admin123
      accountNumber: 'ACC9999999',
      balance: 1000000,
      role: 'admin',
      createdAt: new Date()
    }
  ];
  
  return inMemoryDB;
};

const getDB = () => inMemoryDB;

module.exports = { connectDB, getDB };

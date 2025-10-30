// MongoDB Configuration
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transacthub';
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
    console.log('📦 Database: transacthub');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };

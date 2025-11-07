// MongoDB Configuration with Replica Set Support
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/transacthub';
    
    // Connection options optimized for replica sets
    const options = {
      // Read from secondary nodes when possible (load distribution)
      readPreference: 'secondaryPreferred',
      
      // Write concern: ensure data is written to majority of nodes
      writeConcern: {
        w: 'majority',
        j: true, // Wait for journal confirmation
        wtimeout: 5000
      },
      
      // Retry writes on network errors
      retryWrites: true,
      
      // Retry reads on network errors
      retryReads: true,
      
      // Server selection timeout
      serverSelectionTimeoutMS: 5000,
      
      // Socket timeout
      socketTimeoutMS: 45000
    };
    
    await mongoose.connect(MONGO_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log('📦 Database: transacthub');
    console.log('🔄 Replica Set: Enabled (Atlas Cluster)');
    console.log('📖 Read Preference: Secondary Preferred');
    console.log('✍️  Write Concern: Majority');
    
    // Log connection details
    const { host, port, name } = mongoose.connection;
    console.log(`🌐 Connected to: ${host}${port ? ':' + port : ''}`);
    console.log(`🗄️  Database Name: ${name}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('💡 Ensure MongoDB Atlas cluster is running and connection string is correct');
    process.exit(1);
  }
};

// Listen for connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = { connectDB };

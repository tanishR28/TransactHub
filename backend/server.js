// TransactHub - Distributed Banking System Server
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const systemRoutes = require('./routes/systemRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/system', systemRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🏦 TransactHub - Distributed Banking System API',
    version: '2.0',
    endpoints: {
      auth: '/api/auth',
      transactions: '/api/transactions',
      system: '/api/system'
    },
    features: [
      'Client-Server Communication',
      'Multithreading Simulation',
      'Lamport Clock Synchronization',
      'Leader Election (Bully Algorithm)',
      'Primary-Backup Replication',
      'Load Balancing (Round Robin, Weighted, Least Connections)',
      'Fault Tolerance Simulation'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const { getSimulator } = require('./utils/nodeSimulator');
  const simulator = getSimulator();
  const stats = simulator.getSystemStats();

  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    nodes: stats
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await connectDB();

    // Initialize distributed system components
    const { getSimulator } = require('./utils/nodeSimulator');
    const { getLeaderElection } = require('./utils/leaderElection');
    
    const simulator = getSimulator();
    const election = getLeaderElection();
    
    // Elect initial leader
    election.electLeader();
    
    console.log('\n🎯 Distributed System Initialized:');
    console.log(`   - ${simulator.nodes.length} virtual nodes created`);
    console.log(`   - Primary node: ${simulator.primaryNodeId}`);
    console.log(`   - Load balancing: Round Robin`);
    console.log(`   - Replication: Primary-Backup\n`);

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 TransactHub Server Running`);
      console.log(`   URL: http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`${'='.repeat(50)}\n`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

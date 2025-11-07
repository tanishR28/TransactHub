// Node 3 Server - Distributed System
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();
const NODE_ID = 3;
const PORT = 4003;

// Middleware
app.use(cors());
app.use(express.json());

// Inject node ID into all requests
app.use((req, res, next) => {
  req.nodeId = NODE_ID;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    nodeId: NODE_ID, 
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🟢 Node ${NODE_ID} running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error(`❌ Node ${NODE_ID} failed to start:`, err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(`🔴 Node ${NODE_ID} shutting down...`);
  process.exit(0);
});

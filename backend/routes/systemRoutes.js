// System Routes - Distributed system management
const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Node management routes (admin only)
router.get('/nodes', authenticateToken, isAdmin, systemController.getNodes);
router.get('/stats', authenticateToken, isAdmin, systemController.getSystemStats);
router.post('/nodes/:nodeId/status', authenticateToken, isAdmin, systemController.setNodeStatus);

// Leader election routes (admin only)
router.post('/elect-leader', authenticateToken, isAdmin, systemController.electLeader);
router.get('/election-history', authenticateToken, isAdmin, systemController.getElectionHistory);

// Load balancing routes (admin only)
router.post('/load-balancing/strategy', authenticateToken, isAdmin, systemController.setLoadBalancingStrategy);
router.get('/load-balancing/distribution', authenticateToken, isAdmin, systemController.getLoadDistribution);

// Replication routes (admin only)
router.post('/replication/sync', authenticateToken, isAdmin, systemController.syncNodes);
router.get('/replication/status', authenticateToken, isAdmin, systemController.getReplicationStatus);
router.get('/replication/log', authenticateToken, isAdmin, systemController.getReplicationLog);

// Clock synchronization route (admin only)
router.post('/sync-clocks', authenticateToken, isAdmin, systemController.syncClocks);

module.exports = router;

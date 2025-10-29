// System Controller - Manages distributed system operations
const { getSimulator } = require('../utils/nodeSimulator');
const { getLeaderElection } = require('../utils/leaderElection');
const { getLoadBalancer } = require('../utils/loadBalancer');
const { getReplicationManager } = require('../utils/replication');

// Get all nodes status
exports.getNodes = async (req, res) => {
  try {
    const simulator = getSimulator();
    const nodes = simulator.getAllNodes();

    res.json({
      success: true,
      nodes
    });

  } catch (error) {
    console.error('Get nodes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get nodes',
      error: error.message 
    });
  }
};

// Get system statistics
exports.getSystemStats = async (req, res) => {
  try {
    const simulator = getSimulator();
    const stats = simulator.getSystemStats();
    
    const loadBalancer = getLoadBalancer();
    const loadDistribution = loadBalancer.getDistribution();

    res.json({
      success: true,
      systemStats: stats,
      loadBalancing: loadDistribution
    });

  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get system stats',
      error: error.message 
    });
  }
};

// Trigger leader election
exports.electLeader = async (req, res) => {
  try {
    const election = getLeaderElection();
    const result = election.electLeader();

    res.json({
      success: result.success,
      message: result.message || 'Election completed',
      result
    });

  } catch (error) {
    console.error('Election error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Election failed',
      error: error.message 
    });
  }
};

// Get election history
exports.getElectionHistory = async (req, res) => {
  try {
    const election = getLeaderElection();
    const history = election.getHistory();

    res.json({
      success: true,
      history
    });

  } catch (error) {
    console.error('Get election history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get election history',
      error: error.message 
    });
  }
};

// Change load balancing strategy
exports.setLoadBalancingStrategy = async (req, res) => {
  try {
    const { strategy } = req.body;
    
    if (!strategy) {
      return res.status(400).json({ 
        success: false, 
        message: 'Strategy is required' 
      });
    }

    const loadBalancer = getLoadBalancer();
    const result = loadBalancer.setStrategy(strategy);

    res.json({
      success: true,
      message: 'Strategy updated',
      ...result
    });

  } catch (error) {
    console.error('Set strategy error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get load distribution
exports.getLoadDistribution = async (req, res) => {
  try {
    const loadBalancer = getLoadBalancer();
    const distribution = loadBalancer.getDistribution();

    res.json({
      success: true,
      distribution
    });

  } catch (error) {
    console.error('Get load distribution error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get load distribution',
      error: error.message 
    });
  }
};

// Set node status (simulate failure/recovery)
exports.setNodeStatus = async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { alive } = req.body;

    if (typeof alive !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: 'alive parameter must be boolean' 
      });
    }

    const simulator = getSimulator();
    const result = simulator.setNodeStatus(parseInt(nodeId), alive);

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Node not found' 
      });
    }

    // If primary node failed, trigger election
    if (!alive && result.isPrimary) {
      const election = getLeaderElection();
      election.handlePrimaryFailure();
    }

    res.json({
      success: true,
      message: alive ? 'Node recovered' : 'Node failed',
      node: result
    });

  } catch (error) {
    console.error('Set node status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to set node status',
      error: error.message 
    });
  }
};

// Synchronize all nodes
exports.syncNodes = async (req, res) => {
  try {
    const replicationManager = getReplicationManager();
    const result = await replicationManager.syncAllNodes();

    res.json(result);

  } catch (error) {
    console.error('Sync nodes error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to sync nodes',
      error: error.message 
    });
  }
};

// Get replication status
exports.getReplicationStatus = async (req, res) => {
  try {
    const replicationManager = getReplicationManager();
    const status = replicationManager.getReplicationStatus();

    res.json({
      success: true,
      replication: status
    });

  } catch (error) {
    console.error('Get replication status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get replication status',
      error: error.message 
    });
  }
};

// Get replication log
exports.getReplicationLog = async (req, res) => {
  try {
    const replicationManager = getReplicationManager();
    const log = replicationManager.getReplicationLog();

    res.json({
      success: true,
      count: log.length,
      log
    });

  } catch (error) {
    console.error('Get replication log error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get replication log',
      error: error.message 
    });
  }
};

// Synchronize clocks (Berkeley algorithm simulation)
exports.syncClocks = async (req, res) => {
  try {
    const simulator = getSimulator();
    const avgTime = simulator.clockManager.synchronizeClocks();

    res.json({
      success: true,
      message: 'Clocks synchronized',
      averageTime: avgTime,
      clocks: simulator.clockManager.getAllClocks()
    });

  } catch (error) {
    console.error('Sync clocks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to sync clocks',
      error: error.message 
    });
  }
};

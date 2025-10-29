// Data Replication - Primary-Backup Strategy
// Ensures data consistency across all nodes

const { getSimulator } = require('./nodeSimulator');

class ReplicationManager {
  constructor() {
    this.replicationLog = [];
    this.replicationDelay = 100; // Simulate network delay (ms)
  }

  // Replicate transaction to all backup nodes
  async replicateTransaction(transaction) {
    const simulator = getSimulator();
    const primary = simulator.getPrimaryNode();

    if (!primary) {
      return {
        success: false,
        message: 'No primary node available'
      };
    }

    // Get all backup nodes (alive, non-primary)
    const backups = simulator.nodes.filter(n => 
      !n.isPrimary && n.alive
    );

    if (backups.length === 0) {
      console.log('⚠️  No backup nodes available for replication');
      return {
        success: true,
        replicatedTo: [],
        message: 'No backups available'
      };
    }

    // Simulate async replication with delay
    const replicationPromises = backups.map(backup => 
      this.replicateToNode(backup, transaction)
    );

    const results = await Promise.allSettled(replicationPromises);
    
    const successfulReplications = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(r => r.value.nodeId);

    const replicationRecord = {
      transactionId: transaction._id,
      primaryNode: primary.id,
      replicatedTo: successfulReplications,
      timestamp: new Date(),
      success: successfulReplications.length > 0
    };

    this.replicationLog.push(replicationRecord);

    console.log(`🔄 Replicated transaction to ${successfulReplications.length} backup nodes`);

    return {
      success: true,
      replicatedTo: successfulReplications,
      totalBackups: backups.length
    };
  }

  // Replicate to a single node with simulated delay
  async replicateToNode(node, transaction) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          node.processTransaction(transaction);
          resolve({
            success: true,
            nodeId: node.id
          });
        } catch (error) {
          resolve({
            success: false,
            nodeId: node.id,
            error: error.message
          });
        }
      }, this.replicationDelay);
    });
  }

  // Sync all backups with primary ledger
  async syncAllNodes() {
    const simulator = getSimulator();
    const synced = simulator.syncAllNodes();

    if (synced) {
      console.log('✅ All backup nodes synchronized with primary');
      return {
        success: true,
        message: 'All nodes synchronized'
      };
    }

    return {
      success: false,
      message: 'Failed to synchronize nodes'
    };
  }

  // Get replication status for all nodes
  getReplicationStatus() {
    const simulator = getSimulator();
    const nodes = simulator.getAllNodes();
    const primary = simulator.getPrimaryNode();

    if (!primary) {
      return {
        status: 'No primary node',
        nodes: []
      };
    }

    const primaryLedgerSize = primary.ledger.length;

    return {
      primaryNode: primary.id,
      primaryLedgerSize,
      nodes: nodes.map(n => ({
        nodeId: n.id,
        isPrimary: n.isPrimary,
        alive: n.alive,
        ledgerSize: n.ledgerSize,
        inSync: n.ledgerSize === primaryLedgerSize,
        lag: primaryLedgerSize - n.ledgerSize
      })),
      recentReplications: this.replicationLog.slice(-10)
    };
  }

  // Get replication history
  getReplicationLog() {
    return this.replicationLog;
  }
}

// Singleton instance
let replicationInstance = null;

function getReplicationManager() {
  if (!replicationInstance) {
    replicationInstance = new ReplicationManager();
  }
  return replicationInstance;
}

module.exports = { ReplicationManager, getReplicationManager };

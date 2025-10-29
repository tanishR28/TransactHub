// Node Simulator - Creates virtual nodes in single backend
// Simulates distributed environment without multiple servers

const { ClockManager } = require('./lamportClock');

class VirtualNode {
  constructor(id, isPrimary = false) {
    this.id = id;
    this.isPrimary = isPrimary;
    this.alive = true;
    this.ledger = []; // Transactions processed by this node
    this.requestsHandled = 0;
    this.lastActive = Date.now();
    this.responseTime = Math.floor(Math.random() * 100) + 50; // 50-150ms
  }

  processTransaction(transaction) {
    if (!this.alive) {
      throw new Error(`Node ${this.id} is down`);
    }

    this.ledger.push({
      ...transaction,
      processedAt: Date.now(),
      nodeId: this.id
    });
    
    this.requestsHandled++;
    this.lastActive = Date.now();

    return {
      success: true,
      nodeId: this.id,
      transaction
    };
  }

  syncLedger(transactions) {
    // Replicate transactions from primary
    transactions.forEach(txn => {
      const exists = this.ledger.find(t => t._id === txn._id);
      if (!exists) {
        this.ledger.push(txn);
      }
    });
  }

  getStatus() {
    return {
      id: this.id,
      isPrimary: this.isPrimary,
      alive: this.alive,
      requestsHandled: this.requestsHandled,
      ledgerSize: this.ledger.length,
      lastActive: this.lastActive,
      responseTime: this.responseTime
    };
  }

  fail() {
    this.alive = false;
  }

  recover() {
    this.alive = true;
    this.lastActive = Date.now();
  }
}

class NodeSimulator {
  constructor(nodeCount = 5) {
    this.nodes = [];
    this.clockManager = new ClockManager();
    this.primaryNodeId = 1;
    
    // Initialize nodes
    for (let i = 1; i <= nodeCount; i++) {
      const node = new VirtualNode(i, i === this.primaryNodeId);
      this.nodes.push(node);
      this.clockManager.createClock(i);
    }

    console.log(`✅ Initialized ${nodeCount} virtual nodes`);
  }

  getNode(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  getPrimaryNode() {
    return this.nodes.find(n => n.isPrimary);
  }

  getAliveNodes() {
    return this.nodes.filter(n => n.alive);
  }

  getAllNodes() {
    return this.nodes.map(n => ({
      ...n.getStatus(),
      clock: this.clockManager.getClock(n.id).now()
    }));
  }

  setNodeStatus(nodeId, alive) {
    const node = this.getNode(nodeId);
    if (!node) return null;

    if (alive) {
      node.recover();
    } else {
      node.fail();
    }

    return node.getStatus();
  }

  setPrimary(nodeId) {
    // Remove primary from all nodes
    this.nodes.forEach(n => n.isPrimary = false);
    
    // Set new primary
    const node = this.getNode(nodeId);
    if (node && node.alive) {
      node.isPrimary = true;
      this.primaryNodeId = nodeId;
      return true;
    }
    return false;
  }

  syncAllNodes() {
    const primary = this.getPrimaryNode();
    if (!primary) return false;

    const backups = this.nodes.filter(n => !n.isPrimary && n.alive);
    backups.forEach(backup => {
      backup.syncLedger(primary.ledger);
    });

    return true;
  }

  getSystemStats() {
    const totalRequests = this.nodes.reduce((sum, n) => sum + n.requestsHandled, 0);
    const aliveCount = this.getAliveNodes().length;
    const avgResponseTime = this.nodes.reduce((sum, n) => sum + n.responseTime, 0) / this.nodes.length;

    return {
      totalNodes: this.nodes.length,
      aliveNodes: aliveCount,
      primaryNodeId: this.primaryNodeId,
      totalRequests,
      avgResponseTime: Math.floor(avgResponseTime),
      clocks: this.clockManager.getAllClocks()
    };
  }
}

// Singleton instance
let simulatorInstance = null;

function getSimulator() {
  if (!simulatorInstance) {
    simulatorInstance = new NodeSimulator(5);
  }
  return simulatorInstance;
}

module.exports = { NodeSimulator, getSimulator };

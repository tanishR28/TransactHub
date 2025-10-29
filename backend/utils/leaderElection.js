// Leader Election - Bully Algorithm Implementation
// Ensures one node is always the leader (primary)

const { getSimulator } = require('./nodeSimulator');

class LeaderElection {
  constructor() {
    this.electionInProgress = false;
    this.electionHistory = [];
  }

  // Bully Algorithm: Node with highest ID among alive nodes becomes leader
  electLeader() {
    if (this.electionInProgress) {
      return { success: false, message: 'Election already in progress' };
    }

    this.electionInProgress = true;
    const simulator = getSimulator();
    
    console.log('🗳️  Starting leader election (Bully Algorithm)...');

    // Get all alive nodes
    const aliveNodes = simulator.getAliveNodes();
    
    if (aliveNodes.length === 0) {
      this.electionInProgress = false;
      return { 
        success: false, 
        message: 'No alive nodes to elect leader' 
      };
    }

    // Select node with highest ID (Bully algorithm)
    const newLeader = aliveNodes.reduce((max, node) => 
      node.id > max.id ? node : max
    );

    // Set new primary
    simulator.setPrimary(newLeader.id);

    const electionResult = {
      timestamp: new Date(),
      newLeaderId: newLeader.id,
      aliveNodes: aliveNodes.map(n => n.id),
      algorithm: 'Bully'
    };

    this.electionHistory.push(electionResult);
    this.electionInProgress = false;

    console.log(`👑 Node ${newLeader.id} elected as new leader`);

    return {
      success: true,
      leader: newLeader.id,
      ...electionResult
    };
  }

  // Trigger election when primary fails
  handlePrimaryFailure() {
    const simulator = getSimulator();
    const primary = simulator.getPrimaryNode();

    if (primary && !primary.alive) {
      console.log(`❌ Primary node ${primary.id} failed. Triggering election...`);
      return this.electLeader();
    }

    return { success: false, message: 'Primary is still alive' };
  }

  // Get election history
  getHistory() {
    return this.electionHistory;
  }

  // Get current leader
  getCurrentLeader() {
    const simulator = getSimulator();
    const primary = simulator.getPrimaryNode();
    return primary ? primary.id : null;
  }
}

// Singleton instance
let electionInstance = null;

function getLeaderElection() {
  if (!electionInstance) {
    electionInstance = new LeaderElection();
  }
  return electionInstance;
}

module.exports = { LeaderElection, getLeaderElection };

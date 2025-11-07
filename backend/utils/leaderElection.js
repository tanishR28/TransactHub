// Leader Election - Bully Algorithm Implementation
// Ensures one node is always the leader (primary)

const { getSimulator } = require('./nodeSimulator');

class LeaderElection {
  constructor() {
    this.electionInProgress = false;
    this.electionHistory = [];
    this.rotationIndex = -1; // Start at -1 so first increment gives 0
    this.lastLeaderId = null; // Track last leader
  }

  // Ring-based Rotation Algorithm: Rotates leadership among alive nodes
  electLeader() {
    if (this.electionInProgress) {
      return { success: false, message: 'Election already in progress' };
    }

    this.electionInProgress = true;
    const simulator = getSimulator();
    
    console.log('🗳️  Starting leader election (Ring Rotation Algorithm)...');

    // Get all alive nodes sorted by ID
    const aliveNodes = simulator.getAliveNodes().sort((a, b) => a.id - b.id);
    
    if (aliveNodes.length === 0) {
      this.electionInProgress = false;
      return { 
        success: false, 
        message: 'No alive nodes to elect leader' 
      };
    }

    // Find current leader's index in alive nodes
    let currentLeaderIndex = -1;
    if (this.lastLeaderId) {
      currentLeaderIndex = aliveNodes.findIndex(n => n.id === this.lastLeaderId);
      console.log(`📍 Last leader was Node ${this.lastLeaderId} at index ${currentLeaderIndex}`);
    } else {
      console.log(`📍 First election, no previous leader`);
    }

    // Select next node in rotation (round-robin)
    const nextIndex = (currentLeaderIndex + 1) % aliveNodes.length;
    const newLeader = aliveNodes[nextIndex];
    
    console.log(`🔄 Rotating: currentIndex=${currentLeaderIndex}, nextIndex=${nextIndex}, aliveNodes=[${aliveNodes.map(n => n.id).join(', ')}]`);
    console.log(`👉 Selected Node ${newLeader.id} as new leader`);
    
    // Update tracking
    this.lastLeaderId = newLeader.id;
    this.rotationIndex = nextIndex;

    // Validate newLeader exists and has id
    if (!newLeader || !newLeader.id) {
      this.electionInProgress = false;
      console.error('❌ Error: Invalid leader node selected', newLeader);
      return { 
        success: false, 
        message: 'Invalid leader node selected' 
      };
    }

    // Set new primary
    simulator.setPrimary(newLeader.id);

    const electionResult = {
      timestamp: new Date(),
      newLeaderId: newLeader.id,
      aliveNodes: aliveNodes.map(n => n.id),
      algorithm: 'Ring Rotation',
      rotationIndex: this.rotationIndex
    };

    this.electionHistory.push(electionResult);
    this.electionInProgress = false;

    console.log(`👑 Node ${newLeader.id} elected as new leader (Ring Rotation)`);

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

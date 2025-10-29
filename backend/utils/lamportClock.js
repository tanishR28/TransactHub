// Lamport Logical Clock Implementation
// Ensures causal ordering of events in distributed system

class LamportClock {
  constructor(nodeId, initialTime = 0) {
    this.nodeId = nodeId;
    this.time = initialTime;
  }

  // Increment clock on local event
  tick() {
    this.time += 1;
    return this.time;
  }

  // Update clock on receiving message
  update(receivedTime) {
    this.time = Math.max(this.time, receivedTime) + 1;
    return this.time;
  }

  // Get current time
  now() {
    return this.time;
  }

  // Send timestamp with message
  sendTimestamp() {
    return {
      time: this.tick(),
      nodeId: this.nodeId
    };
  }

  // Receive timestamp and update
  receiveTimestamp(receivedTime) {
    return this.update(receivedTime);
  }
}

// Global clock manager for all nodes
class ClockManager {
  constructor() {
    this.clocks = new Map();
  }

  createClock(nodeId, initialTime = 0) {
    const clock = new LamportClock(nodeId, initialTime);
    this.clocks.set(nodeId, clock);
    return clock;
  }

  getClock(nodeId) {
    return this.clocks.get(nodeId);
  }

  getAllClocks() {
    const clockData = {};
    this.clocks.forEach((clock, nodeId) => {
      clockData[nodeId] = clock.now();
    });
    return clockData;
  }

  // Synchronize clocks (Berkeley Algorithm simulation)
  synchronizeClocks() {
    const times = Array.from(this.clocks.values()).map(c => c.now());
    const avgTime = Math.floor(times.reduce((a, b) => a + b, 0) / times.length);
    
    this.clocks.forEach(clock => {
      clock.time = avgTime;
    });

    return avgTime;
  }
}

module.exports = { LamportClock, ClockManager };

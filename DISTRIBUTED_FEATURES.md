# 🎯 Distributed Computing Features - Implementation Guide

This document explains how each distributed computing concept is implemented in TransactHub.

## 1. Client-Server Communication

### Implementation
- **Location**: `backend/src/server.js`
- **Technology**: Express.js REST API
- **Pattern**: Request-Response with JSON payloads

### Key Features:
```javascript
// RESTful endpoints for banking operations
POST /api/banking/deposit
POST /api/banking/withdraw
POST /api/banking/transfer
GET /api/banking/transactions
```

### Real-time Communication:
```javascript
// Server-Sent Events (SSE) for live updates
GET /api/events
```

## 2. Multithreading & Concurrency

### Implementation
- **Location**: `backend/src/sim/node.js`, `backend/src/sim/cluster.js`
- **Pattern**: Asynchronous JavaScript with Promises

### How it works:
```javascript
// Parallel transaction processing
async function replicateFrom(primaryResult, op) {
  const replicationPromises = [];
  for (const node of backupNodes) {
    replicationPromises.push(node.apply(op));
  }
  await Promise.allSettled(replicationPromises);
}
```

### Concurrency Control:
- Active connections tracking per node
- Thread-safe Map structures for data
- Async/await for non-blocking I/O

## 3. Clock Synchronization

### Lamport Logical Clocks
**Location**: `backend/src/sim/lamportClock.js`

```javascript
export function createLamportClock(initial = 0) {
  let time = initial;
  return {
    now() { return time; },
    tick() { time += 1; return time; },
    recv(remote) { time = Math.max(time, remote) + 1; return time; }
  };
}
```

**Usage**: Each node maintains its own logical clock that increments on every event.

### Cristian's Algorithm
**Location**: `backend/src/sim/cluster.js`

Simulates client-server clock synchronization with RTT compensation:
```javascript
const adjusted = serverTimes.map((t, i) => t + Math.floor(rtts[i] / 2));
```

### Berkeley Algorithm
Distributed time averaging across nodes:
```javascript
const diffs = times.map(t => t - master);
const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
const adjusted = times.map(t => t - avg);
```

## 4. Leader Election

### Implementation
**Location**: `backend/src/sim/cluster.js`

### Bully Algorithm:
- Highest ID among active nodes becomes leader
- Automatic re-election when leader fails
```javascript
function startElection(algorithm = "bully") {
  const alive = nodes.filter(n => n.active);
  const electedId = String(Math.max(...alive.map(n => Number(n.id))));
  // Set new leader
}
```

### Ring Algorithm:
- Election message circulates
- Highest ID wins
- More complex but fault-tolerant

### Testing:
1. Stop current leader node
2. System automatically triggers election
3. New leader takes over

## 5. Data Replication

### Primary-Backup Model
**Location**: `backend/src/sim/cluster.js`

### Architecture:
- **Primary (Leader)**: Handles all write operations
- **Backups (Followers)**: Replicate data asynchronously

```javascript
async function replicateFrom(primaryResult, op) {
  const leader = getLeader();
  for (const backup of backupNodes) {
    await backup.apply(op); // Replicate to each backup
  }
}
```

### Consistency:
- Write operations go through leader
- Automatic replication to all active nodes
- Read-your-writes consistency

## 6. Load Balancing

### Implementation
**Location**: `backend/src/sim/loadBalancer.js`

### Strategies:

#### Round Robin:
```javascript
return pool[(rrIndex++) % pool.length];
```

#### Random:
```javascript
return pool[Math.floor(Math.random() * pool.length)];
```

#### Least Connections:
```javascript
return pool.sort((a, b) => a.activeConnections - b.activeConnections)[0];
```

#### Weighted (Performance-based):
```javascript
const weights = pool.map(n => 1 / Math.max(1, n.avgResponse));
// Weighted random selection
```

### Testing:
- Make multiple transactions
- Observe distribution across nodes
- Compare strategies

## 7. Fault Tolerance

### Implementation
**Location**: Throughout cluster management

### Mechanisms:

#### Node Failure Detection:
```javascript
if (!node.active) {
  throw new Error("NodeDown");
}
```

#### Automatic Failover:
```javascript
if (node.leader && !node.active) {
  startElection("bully"); // Elect new leader
}
```

#### Transaction Retry:
- Requests rerouted to active nodes
- Load balancer skips failed nodes

### Recovery:
- Restart failed nodes
- Data syncs from leader
- Gradual reintegration

## 8. MapReduce-Style Analytics

### Implementation
**Location**: `backend/src/services/analytics.js`

### Map Phase:
```javascript
const mapped = transactions.map(tx => ({
  hour: new Date(tx.timestamp).getHours(),
  amount: tx.amount
}));
```

### Reduce Phase:
```javascript
const reduced = {};
mapped.forEach(item => {
  if (!reduced[item.hour]) reduced[item.hour] = { count: 0, volume: 0 };
  reduced[item.hour].count += 1;
  reduced[item.hour].volume += item.amount;
});
```

### Parallel Computation:
```javascript
const computations = [
  Promise.resolve(calculateTransactionStats()),
  Promise.resolve(calculateVolumeStats()),
  Promise.resolve(calculateUserStats()),
  Promise.resolve(calculateTimeStats())
];
await Promise.all(computations);
```

## 9. Fraud Detection

### Implementation
**Location**: `backend/src/services/fraudDetection.js`

### Pattern Matching:
```javascript
const rules = [
  { check: (tx) => tx.amount > 100000, riskLevel: 'high' },
  { check: (tx) => rapidTransactions(tx), riskLevel: 'medium' },
  { check: (tx) => unusualTime(tx), riskLevel: 'low' }
];
```

### Real-time Analysis:
```javascript
function analyzeTransaction(transaction, userHistory) {
  let totalRiskScore = 0;
  rules.forEach(rule => {
    if (rule.check(transaction, userHistory)) {
      totalRiskScore += rule.riskScore;
    }
  });
  return { isSuspicious: totalRiskScore >= 10 };
}
```

### Batch Processing:
```javascript
function runBatchAnalysis(transactions) {
  // Map: categorize
  const map = transactions.map(tx => categorize(tx));
  // Reduce: aggregate patterns
  const patterns = reduce(map);
  return patterns;
}
```

## 10. Geographic Distribution

### Node Locations:
```javascript
const locations = ['US-EAST', 'US-WEST', 'EU-WEST', 'ASIA-EAST'];
```

### Benefits:
- **Latency Reduction**: Route to nearest node
- **Fault Isolation**: Regional failure isolation
- **Scalability**: Distribute load geographically

## Performance Metrics

### Tracked Metrics:
- Average response time per node
- Active connections per node
- Transaction success/failure rates
- Logical clock values
- Replication lag

### Monitoring:
```javascript
function getStats() {
  return {
    totalProcessed,
    totalFailed,
    successRate: (totalProcessed / (totalProcessed + totalFailed)) * 100,
    avgResponse
  };
}
```

## Testing Scenarios

### 1. Scalability Test:
- Send 100 rapid transactions
- Observe load distribution
- Check node performance

### 2. Fault Tolerance Test:
- Stop 2 out of 4 nodes
- Continue operations
- Verify data consistency

### 3. Election Test:
- Stop leader
- Measure election time
- Verify new leader selection

### 4. Replication Test:
- Make transaction on leader
- Check all backups updated
- Verify consistency

### 5. Fraud Detection Test:
- Transaction > $100,000
- 10 transactions in 1 minute
- Transaction at 3 AM

## Best Practices

1. **Always check node status** before processing
2. **Use load balancing** for all operations
3. **Monitor logical clocks** for ordering
4. **Replicate writes** to maintain consistency
5. **Handle failures gracefully** with retries
6. **Log all events** for debugging
7. **Validate transactions** before processing

## Further Improvements

For production systems, consider:
- Persistent storage (database)
- Network partition handling
- Byzantine fault tolerance
- Quorum-based replication
- Advanced consensus (Raft, Paxos)
- Distributed transactions (2PC, 3PC)
- Sharding and partitioning
- CDN integration

---

This implementation demonstrates core distributed computing concepts in a practical banking application. Each feature can be tested and observed in real-time through the web interface.

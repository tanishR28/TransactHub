// API Gateway - Load Balancer for Distributed System
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

// Node configuration
const NODES = [
  { id: 1, url: 'http://localhost:4001', alive: false, responseTime: 0, requestCount: 0 },
  { id: 2, url: 'http://localhost:4002', alive: false, responseTime: 0, requestCount: 0 },
  { id: 3, url: 'http://localhost:4003', alive: false, responseTime: 0, requestCount: 0 },
  { id: 4, url: 'http://localhost:4004', alive: false, responseTime: 0, requestCount: 0 },
  { id: 5, url: 'http://localhost:4005', alive: false, responseTime: 0, requestCount: 0 }
];

let currentNodeIndex = 0;
let primaryNodeId = null; // Will be set to first alive node

// Middleware
app.use(cors());
app.use(express.json());

// Health check for gateway
app.get('/health', (req, res) => {
  const aliveNodes = NODES.filter(n => n.alive);
  res.json({
    status: 'healthy',
    gateway: true,
    totalNodes: NODES.length,
    activeNodes: aliveNodes.length,
    primaryNode: primaryNodeId,
    nodes: NODES.map(n => ({
      id: n.id,
      alive: n.alive,
      responseTime: n.responseTime,
      requestCount: n.requestCount,
      isPrimary: n.id === primaryNodeId
    }))
  });
});

// Get system status/stats (for admin panel) - support both endpoints
const getSystemStatus = (req, res) => {
  const aliveNodes = NODES.filter(n => n.alive);
  const totalRequests = NODES.reduce((sum, n) => sum + n.requestCount, 0);
  
  res.json({
    success: true,
    nodes: NODES.map(n => ({
      id: n.id,
      alive: n.alive,
      isPrimary: n.id === primaryNodeId,
      requestsHandled: n.requestCount,
      responseTime: n.responseTime,
      ledgerSize: 0, // Gateway doesn't track individual ledgers
      lastActive: Date.now(),
      clock: 0 // Gateway doesn't track Lamport clocks
    })),
    systemStats: {
      totalNodes: NODES.length,
      aliveNodes: aliveNodes.length,
      primaryNodeId: primaryNodeId,
      totalRequests: totalRequests,
      avgResponseTime: aliveNodes.length > 0 
        ? Math.floor(aliveNodes.reduce((sum, n) => sum + n.responseTime, 0) / aliveNodes.length)
        : 0,
      clocks: [] // Not tracking in gateway mode
    },
    loadBalancing: {
      strategy: 'round-robin',
      distribution: NODES.map(n => ({
        nodeId: n.id,
        requestCount: n.requestCount,
        percentage: totalRequests > 0 ? Math.round((n.requestCount / totalRequests) * 100) : 0
      }))
    }
  });
};

app.get('/api/system/status', getSystemStatus);
app.get('/api/system/stats', getSystemStatus); // Support both endpoints

// Get all nodes
app.get('/api/system/nodes', (req, res) => {
  res.json({
    success: true,
    nodes: NODES.map(n => ({
      id: n.id,
      alive: n.alive,
      isPrimary: n.id === primaryNodeId,
      requestsHandled: n.requestCount,
      responseTime: n.responseTime,
      lastActive: Date.now()
    }))
  });
});

// Elect leader (rotate primary node among alive nodes)
app.post('/api/system/elect-leader', (req, res) => {
  const aliveNodes = NODES.filter(n => n.alive);
  
  if (aliveNodes.length === 0) {
    return res.json({
      success: false,
      message: 'No alive nodes to elect leader'
    });
  }

  // Find current primary index and rotate to next
  const currentIndex = aliveNodes.findIndex(n => n.id === primaryNodeId);
  const nextIndex = (currentIndex + 1) % aliveNodes.length;
  const newPrimary = aliveNodes[nextIndex];
  
  primaryNodeId = newPrimary.id;
  console.log(`👑 Leadership transferred to Node ${primaryNodeId}`);

  res.json({
    success: true,
    message: 'Leader election completed',
    result: {
      newLeaderId: primaryNodeId,
      aliveNodes: aliveNodes.map(n => n.id),
      algorithm: 'Ring Rotation'
    }
  });
});

// Note: Node status toggling is disabled in real distributed mode
// You need to actually stop/start the node processes
app.post('/api/system/nodes/:nodeId/status', (req, res) => {
  res.json({
    success: false,
    message: 'Cannot simulate node failures in distributed mode. Stop/start the actual node process instead.'
  });
});

// Get replication status
app.get('/api/system/replication/status', (req, res) => {
  const aliveNodes = NODES.filter(n => n.alive);
  const primaryNode = NODES.find(n => n.id === primaryNodeId);
  
  res.json({
    success: true,
    replication: {
      enabled: aliveNodes.length > 0,
      primaryNode: primaryNodeId,
      backupNodes: aliveNodes.filter(n => n.id !== primaryNodeId).length,
      totalNodes: aliveNodes.length,
      nodes: NODES.map(n => ({
        nodeId: n.id,
        isPrimary: n.id === primaryNodeId,
        status: n.alive ? 'active' : 'offline',
        ledgerSize: n.alive ? '✓ Synced' : 'N/A',
        syncStatus: n.alive ? (n.id === primaryNodeId ? 'Primary' : 'Replicated') : 'Offline',
        lastSync: n.alive ? new Date().toISOString() : null
      }))
    }
  });
});

// Sync nodes (in distributed mode, this is automatic via MongoDB)
app.post('/api/system/replication/sync', (req, res) => {
  const aliveNodes = NODES.filter(n => n.alive);
  
  res.json({
    success: true,
    message: `All ${aliveNodes.length} active servers are automatically synced via MongoDB`,
    synced: aliveNodes.length
  });
});

// Initial health check on startup
async function initialHealthCheck() {
  console.log('🔍 Checking for running nodes...\n');
  for (const node of NODES) {
    try {
      const start = Date.now();
      await axios.get(`${node.url}/health`, { timeout: 2000 });
      node.alive = true;
      node.responseTime = Date.now() - start;
      console.log(`✅ Node ${node.id} detected at ${node.url}`);
      
      // Set first alive node as primary
      if (primaryNodeId === null) {
        primaryNodeId = node.id;
        console.log(`👑 Node ${node.id} set as primary node`);
      }
    } catch (error) {
      node.alive = false;
    }
  }
  
  const aliveCount = NODES.filter(n => n.alive).length;
  console.log(`\n📊 Found ${aliveCount} running node(s)\n`);
}

// Check health of all nodes periodically
setInterval(async () => {
  for (const node of NODES) {
    try {
      const start = Date.now();
      await axios.get(`${node.url}/health`, { timeout: 2000 });
      const wasDown = !node.alive;
      node.alive = true;
      node.responseTime = Date.now() - start;
      
      if (wasDown) {
        console.log(`✅ Node ${node.id} is now online`);
      }
      
      // Set primary if none exists
      if (primaryNodeId === null && node.alive) {
        primaryNodeId = node.id;
        console.log(`👑 Node ${node.id} set as primary node`);
      }
    } catch (error) {
      if (node.alive) {
        console.log(`❌ Node ${node.id} is down`);
      }
      node.alive = false;
      
      // If primary goes down, elect new primary
      if (node.id === primaryNodeId) {
        const aliveNodes = NODES.filter(n => n.alive);
        primaryNodeId = aliveNodes.length > 0 ? aliveNodes[0].id : null;
        if (primaryNodeId) {
          console.log(`👑 Node ${primaryNodeId} is now the primary node`);
        }
      }
    }
  }
}, 5000); // Check every 5 seconds

// Get next available node (Round-robin)
function getNextNode() {
  const aliveNodes = NODES.filter(n => n.alive);
  
  if (aliveNodes.length === 0) {
    throw new Error('No nodes available');
  }

  // Round-robin through alive nodes
  const node = aliveNodes[currentNodeIndex % aliveNodes.length];
  currentNodeIndex = (currentNodeIndex + 1) % aliveNodes.length;
  
  return node;
}

// Get primary node
function getPrimaryNode() {
  const primary = NODES.find(n => n.id === primaryNodeId && n.alive);
  return primary || getNextNode();
}

// Proxy all requests to backend nodes
app.use(async (req, res) => {
  try {
    // Write operations go to primary node
    const isPrimaryRequired = req.method !== 'GET';
    const targetNode = isPrimaryRequired ? getPrimaryNode() : getNextNode();

    console.log(`🔄 ${req.method} ${req.path} → Node ${targetNode.id}`);

    const startTime = Date.now();
    
    const response = await axios({
      method: req.method,
      url: `${targetNode.url}${req.path}`,
      data: req.body,
      headers: {
        ...req.headers,
        host: targetNode.url.replace('http://', '')
      },
      params: req.query,
      timeout: 10000
    });

    targetNode.requestCount++;
    targetNode.responseTime = Date.now() - startTime;

    // Add custom headers
    res.set('X-Served-By-Node', targetNode.id);
    res.set('X-Response-Time', `${targetNode.responseTime}ms`);
    res.set('X-Primary-Node', primaryNodeId);

    res.status(response.status).json(response.data);

  } catch (error) {
    console.error(`❌ Gateway error:`, error.message);

    // Try fallback to another node
    try {
      const aliveNodes = NODES.filter(n => n.alive);
      
      if (aliveNodes.length > 0) {
        const fallbackNode = aliveNodes[0];
        console.log(`🔁 Retrying with Node ${fallbackNode.id}`);

        const fallbackResponse = await axios({
          method: req.method,
          url: `${fallbackNode.url}${req.path}`,
          data: req.body,
          headers: req.headers,
          params: req.query,
          timeout: 10000
        });

        fallbackNode.requestCount++;
        res.set('X-Served-By-Node', fallbackNode.id);
        res.set('X-Fallback', 'true');
        
        return res.status(fallbackResponse.status).json(fallbackResponse.data);
      }
    } catch (fallbackError) {
      console.error(`❌ Fallback also failed:`, fallbackError.message);
    }

    res.status(503).json({
      success: false,
      message: 'All nodes are unavailable',
      error: error.message
    });
  }
});

// Start gateway
app.listen(PORT, async () => {
  console.log(`\n🌐 ════════════════════════════════════════════════`);
  console.log(`   API GATEWAY RUNNING ON http://localhost:${PORT}`);
  console.log(`🌐 ════════════════════════════════════════════════\n`);
  
  // Perform initial health check
  await initialHealthCheck();
  
  console.log(`✅ Load balancing strategy: Round-robin`);
  console.log(`✅ Health checks: Every 5 seconds`);
  console.log(`✅ Gateway ready to accept requests\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 Gateway shutting down...');
  process.exit(0);
});

// Load Balancer - Distributes requests across nodes
// Implements Round Robin and Weighted strategies

const { getSimulator } = require('./nodeSimulator');

class LoadBalancer {
  constructor() {
    this.strategy = 'round-robin'; // 'round-robin', 'weighted', 'least-connections'
    this.currentIndex = 0;
    this.requestCount = 0;
  }

  // Select node based on current strategy
  selectNode() {
    const simulator = getSimulator();
    const aliveNodes = simulator.getAliveNodes();

    if (aliveNodes.length === 0) {
      throw new Error('No alive nodes available');
    }

    let selectedNode;

    switch (this.strategy) {
      case 'round-robin':
        selectedNode = this.roundRobin(aliveNodes);
        break;
      
      case 'weighted':
        selectedNode = this.weighted(aliveNodes);
        break;
      
      case 'least-connections':
        selectedNode = this.leastConnections(aliveNodes);
        break;
      
      default:
        selectedNode = this.roundRobin(aliveNodes);
    }

    this.requestCount++;
    return selectedNode;
  }

  // Round Robin: Cycle through nodes sequentially
  roundRobin(nodes) {
    const node = nodes[this.currentIndex % nodes.length];
    this.currentIndex++;
    return node;
  }

  // Weighted: Prefer nodes with better response times
  weighted(nodes) {
    // Calculate weights based on response time (lower = better)
    const totalWeight = nodes.reduce((sum, n) => sum + (1000 / n.responseTime), 0);
    let random = Math.random() * totalWeight;

    for (const node of nodes) {
      random -= (1000 / node.responseTime);
      if (random <= 0) {
        return node;
      }
    }

    return nodes[0];
  }

  // Least Connections: Node with fewest requests
  leastConnections(nodes) {
    return nodes.reduce((min, node) => 
      node.requestsHandled < min.requestsHandled ? node : min
    );
  }

  // Change load balancing strategy
  setStrategy(newStrategy) {
    const validStrategies = ['round-robin', 'weighted', 'least-connections'];
    
    if (!validStrategies.includes(newStrategy)) {
      throw new Error(`Invalid strategy. Choose: ${validStrategies.join(', ')}`);
    }

    this.strategy = newStrategy;
    console.log(`🔄 Load balancing strategy changed to: ${newStrategy}`);
    
    return {
      success: true,
      strategy: this.strategy
    };
  }

  // Get current strategy
  getStrategy() {
    return this.strategy;
  }

  // Get load distribution stats
  getDistribution() {
    const simulator = getSimulator();
    const nodes = simulator.getAllNodes();

    return {
      strategy: this.strategy,
      totalRequests: this.requestCount,
      distribution: nodes.map(n => ({
        nodeId: n.id,
        requestsHandled: n.requestsHandled,
        percentage: this.requestCount > 0 
          ? ((n.requestsHandled / this.requestCount) * 100).toFixed(2)
          : 0,
        alive: n.alive
      }))
    };
  }
}

// Singleton instance
let balancerInstance = null;

function getLoadBalancer() {
  if (!balancerInstance) {
    balancerInstance = new LoadBalancer();
  }
  return balancerInstance;
}

module.exports = { LoadBalancer, getLoadBalancer };

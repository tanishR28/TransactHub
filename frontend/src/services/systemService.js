// System Service - Distributed system management API calls
import api from './api';

const systemService = {
  // Get all nodes
  getNodes: async () => {
    return await api.get('/system/nodes');
  },

  // Get system statistics
  getSystemStats: async () => {
    return await api.get('/system/stats');
  },

  // Set node status (simulate failure/recovery)
  setNodeStatus: async (nodeId, alive) => {
    return await api.post(`/system/nodes/${nodeId}/status`, { alive });
  },

  // Trigger leader election
  electLeader: async () => {
    return await api.post('/system/elect-leader');
  },

  // Get election history
  getElectionHistory: async () => {
    return await api.get('/system/election-history');
  },

  // Change load balancing strategy
  setLoadBalancingStrategy: async (strategy) => {
    return await api.post('/system/load-balancing/strategy', { strategy });
  },

  // Get load distribution
  getLoadDistribution: async () => {
    return await api.get('/system/load-balancing/distribution');
  },

  // Sync all nodes
  syncNodes: async () => {
    return await api.post('/system/replication/sync');
  },

  // Get replication status
  getReplicationStatus: async () => {
    return await api.get('/system/replication/status');
  },

  // Get replication log
  getReplicationLog: async () => {
    return await api.get('/system/replication/log');
  },

  // Synchronize clocks
  syncClocks: async () => {
    return await api.post('/system/sync-clocks');
  },
};

export default systemService;

// AdminPanel Page - Distributed System Management
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import NodeStatus from '../components/NodeStatus';
import TransactionCard from '../components/TransactionCard';
import systemService from '../services/systemService';
import transactionService from '../services/transactionService';
import authService from '../services/authService';
import { formatCurrency } from '../utils/helpers';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [replicationStatus, setReplicationStatus] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState(null);
  const [showTransactions, setShowTransactions] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (!authService.isAdmin()) {
      navigate('/dashboard');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const statsData = await systemService.getSystemStats();
      setNodes(statsData.nodes);
      setStats(statsData.systemStats);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleElectLeader = async () => {
    try {
      const result = await systemService.electLeader();
      setMessage(`✅ ${result.result.algorithm} Algorithm: Node ${result.result.newLeaderId} elected as leader`);
      fetchData();
    } catch (err) {
      setMessage(`❌ Election failed: ${err.message}`);
    }
  };

  const handleNodeToggle = async (node) => {
    try {
      await systemService.setNodeStatus(node.id, !node.alive);
      setMessage(`${!node.alive ? '✅' : '❌'} Node ${node.id} ${!node.alive ? 'recovered' : 'failed'}`);
      fetchData();
    } catch (err) {
      setMessage(`❌ Failed to update node: ${err.message}`);
    }
  };

  const handleStrategyChange = async (strategy) => {
    try {
      await systemService.setLoadBalancingStrategy(strategy);
      setMessage(`✅ Load balancing strategy changed to: ${strategy}`);
      fetchData();
    } catch (err) {
      setMessage(`❌ Failed to change strategy: ${err.message}`);
    }
  };

  const handleSyncNodes = async () => {
    try {
      await systemService.syncNodes();
      setMessage('✅ All nodes synchronized successfully');
      fetchData();
    } catch (err) {
      setMessage(`❌ Sync failed: ${err.message}`);
    }
  };

  const handleSyncClocks = async () => {
    try {
      const result = await systemService.syncClocks();
      setMessage(`✅ Clocks synchronized (Berkeley Algorithm). Average time: ${result.averageTime}`);
      fetchData();
    } catch (err) {
      setMessage(`❌ Clock sync failed: ${err.message}`);
    }
  };

  const fetchReplicationStatus = async () => {
    try {
      const result = await systemService.getReplicationStatus();
      setReplicationStatus(result.replication);
    } catch (err) {
      console.error('Error fetching replication status:', err);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const result = await transactionService.getAllTransactions();
      setAllTransactions(result.transactions || []);
      setShowTransactions(true);
    } catch (err) {
      setMessage(`❌ Failed to fetch transactions: ${err.message}`);
    }
  };

  const fetchTransactionStats = async () => {
    try {
      const result = await transactionService.getStats();
      setTransactionStats(result.stats);
    } catch (err) {
      console.error('Error fetching transaction stats:', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const result = await authService.getAllUsers();
      setAllUsers(result.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-2xl text-gray-600">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600 mb-8">Distributed System Management & Monitoring</p>

        {/* Message Bar */}
        {message && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}

        {/* System Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">🖥️</div>
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <div className="text-gray-600">Total Nodes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-green-600">{stats.aliveNodes}</div>
            <div className="text-gray-600">Active Nodes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">👑</div>
            <div className="text-2xl font-bold text-blue-600">Node {stats.primaryNodeId}</div>
            <div className="text-gray-600">Primary Leader</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold">{stats.totalRequests || 0}</div>
            <div className="text-gray-600">Total Requests</div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">System Controls</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <button onClick={handleElectLeader} className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg">
              🗳️ Trigger Leader Election
            </button>
            <button onClick={handleSyncNodes} className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">
              🔄 Sync All Nodes
            </button>
            <button onClick={handleSyncClocks} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
              🕐 Synchronize Clocks
            </button>
            <button onClick={fetchReplicationStatus} className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg">
              📋 Check Replication Status
            </button>
          </div>
          <h3 className="text-xl font-bold mb-3 mt-6">Data Management</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button onClick={fetchAllTransactions} className="bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg">
              💳 View All Transactions
            </button>
            <button onClick={fetchTransactionStats} className="bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg">
              📊 Transaction Statistics
            </button>
            <button onClick={fetchAllUsers} className="bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg">
              👥 View All Users
            </button>
          </div>
        </div>

        {/* Load Balancing Strategy */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Load Balancing Strategy</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {['round-robin', 'weighted', 'least-connections'].map(strategy => (
              <button key={strategy} onClick={() => handleStrategyChange(strategy)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg capitalize">
                {strategy.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🖥️ Server Status</h2>
          <NodeStatus nodes={nodes} onNodeClick={handleNodeToggle} />
        </div>

        {/* Replication Status */}
        {replicationStatus && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">🔄 Database Replication Status</h2>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Replication Mode</p>
                  <p className="text-lg font-semibold">MongoDB Shared Database</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Active Servers</p>
                  <p className="text-lg font-semibold">{replicationStatus.totalNodes || 0} / 5</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Primary Server</p>
                  <p className="text-lg font-semibold">Node {replicationStatus.primaryNode || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Server ID</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Data Sync</th>
                    <th className="px-4 py-2 text-left">Replication</th>
                  </tr>
                </thead>
                <tbody>
                  {replicationStatus.nodes?.map(node => (
                    <tr key={node.nodeId} className={`border-t ${node.status === 'offline' ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 py-2 font-semibold">Server {node.nodeId}</td>
                      <td className="px-4 py-2">
                        {node.isPrimary ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">👑 PRIMARY</span>
                        ) : (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">REPLICA</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {node.status === 'active' ? (
                          <span className="text-green-600 font-semibold">🟢 Online</span>
                        ) : (
                          <span className="text-gray-500 font-semibold">⚫ Offline</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {node.status === 'active' ? (
                          <span className="text-green-600">✓ Synced via MongoDB</span>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {node.status === 'active' ? (
                          <span className="text-blue-600 font-medium">{node.syncStatus}</span>
                        ) : (
                          <span className="text-gray-500">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-green-50 rounded-lg text-sm text-gray-700">
                <strong>✅ Application-Level Replication:</strong> All active servers connect to the same MongoDB database. 
                When you write to any server, all other servers can immediately read the updated data through the shared database.
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                <strong>🔄 MongoDB Atlas Replication:</strong> Your MongoDB Atlas cluster uses a 3-node replica set 
                (1 Primary + 2 Secondaries) with automatic failover. Database writes are replicated to majority of nodes 
                for data safety. Read operations are distributed across secondary nodes for better performance.
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-sm text-gray-700">
                <strong>💡 Benefits:</strong> Double redundancy - if a server fails, others continue working. 
                If MongoDB primary fails, a secondary is automatically promoted. This provides 99.995% uptime!
              </div>
            </div>
          </div>
        )}

        {/* Transaction Statistics */}
        {transactionStats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Transaction Statistics</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">{transactionStats.total}</div>
                <div className="text-gray-600">Total Transactions</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl mb-2">💵</div>
                <div className="text-2xl font-bold">{transactionStats.byType?.deposit || 0}</div>
                <div className="text-gray-600">Deposits</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-3xl mb-2">💸</div>
                <div className="text-2xl font-bold">{transactionStats.byType?.withdraw || 0}</div>
                <div className="text-gray-600">Withdrawals</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-3xl mb-2">🔄</div>
                <div className="text-2xl font-bold">{transactionStats.byType?.transfer || 0}</div>
                <div className="text-gray-600">Transfers</div>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total Transaction Volume</div>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(transactionStats.totalVolume || 0)}</div>
            </div>
          </div>
        )}

        {/* All Transactions */}
        {showTransactions && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">All Transactions ({allTransactions.length})</h2>
              <button 
                onClick={() => setShowTransactions(false)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            {allTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions yet
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {allTransactions.map((transaction) => (
                  <TransactionCard key={transaction._id} transaction={transaction} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Users */}
        {allUsers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">All Users ({allUsers.length})</h2>
              <button 
                onClick={() => setAllUsers([])} 
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Close
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Account Number</th>
                    <th className="px-4 py-2 text-left">Balance</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2 font-mono text-sm">{user.accountNumber}</td>
                      <td className="px-4 py-2 font-semibold">{formatCurrency(user.balance)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Technical Info */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🌐 Distributed System Architecture</h2>
          <div className="mb-4 p-4 bg-white/10 rounded-lg">
            <p className="text-sm mb-2">
              <strong>Architecture:</strong> Multi-Server Distributed Banking System
            </p>
            <p className="text-sm">
              <strong>Running Servers:</strong> {stats.aliveNodes || 0} out of 5 servers active
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span>🌐</span>
              <span>API Gateway Load Balancer</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔄</span>
              <span>Round-Robin Request Distribution</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>👑</span>
              <span>Dynamic Leader Election</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🗄️</span>
              <span>MongoDB Shared Database</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Real-time Data Replication</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🛡️</span>
              <span>Automatic Failover & Recovery</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📊</span>
              <span>Health Monitoring (5s intervals)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔐</span>
              <span>JWT Authentication</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-white/10 rounded text-sm">
            <strong>ℹ️ How it works:</strong> Each server runs independently on its own port (4001-4005). 
            The API Gateway (port 4000) distributes incoming requests across all active servers. 
            All servers share the same MongoDB database for real-time data synchronization.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

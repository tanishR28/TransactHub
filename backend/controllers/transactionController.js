// Transaction Controller - Handles banking operations
const TransactionModel = require('../models/Transaction');
const UserModel = require('../models/User');
const { getLoadBalancer } = require('../utils/loadBalancer');
const { getReplicationManager } = require('../utils/replication');
const { getSimulator } = require('../utils/nodeSimulator');

// Deposit money
exports.deposit = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    // Get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Select node using load balancer
    const loadBalancer = getLoadBalancer();
    const selectedNode = loadBalancer.selectNode();

    // Get Lamport clock
    const simulator = getSimulator();
    const clock = simulator.clockManager.getClock(selectedNode.id);
    const lamportTime = clock.tick();

    // Create transaction
    const transaction = await TransactionModel.create({
      userId,
      type: 'deposit',
      amount,
      fromAccount: user.accountNumber,
      nodeId: selectedNode.id,
      lamportTimestamp: lamportTime,
      status: 'completed'
    });

    // Process on selected node
    selectedNode.processTransaction(transaction.toJSON());

    // Update user balance
    await UserModel.updateBalance(userId, user.balance + amount);

    // Replicate to backup nodes
    const replicationManager = getReplicationManager();
    const replicationResult = await replicationManager.replicateTransaction(transaction.toJSON());

    // Update transaction replication status
    if (replicationResult.success) {
      await TransactionModel.updateReplication(transaction._id, replicationResult.replicatedTo);
    }

    res.json({
      success: true,
      message: 'Deposit successful',
      transaction: transaction.toJSON(),
      newBalance: user.balance + amount,
      processedBy: selectedNode.id,
      lamportTimestamp: lamportTime,
      replication: replicationResult
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Deposit failed',
      error: error.message 
    });
  }
};

// Withdraw money
exports.withdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid amount' 
      });
    }

    // Get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Check sufficient balance
    if (user.balance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Select node using load balancer
    const loadBalancer = getLoadBalancer();
    const selectedNode = loadBalancer.selectNode();

    // Get Lamport clock
    const simulator = getSimulator();
    const clock = simulator.clockManager.getClock(selectedNode.id);
    const lamportTime = clock.tick();

    // Create transaction
    const transaction = await TransactionModel.create({
      userId,
      type: 'withdraw',
      amount,
      fromAccount: user.accountNumber,
      nodeId: selectedNode.id,
      lamportTimestamp: lamportTime,
      status: 'completed'
    });

    // Process on selected node
    selectedNode.processTransaction(transaction.toJSON());

    // Update user balance
    await UserModel.updateBalance(userId, user.balance - amount);

    // Replicate to backup nodes
    const replicationManager = getReplicationManager();
    const replicationResult = await replicationManager.replicateTransaction(transaction.toJSON());

    // Update transaction replication status
    if (replicationResult.success) {
      await TransactionModel.updateReplication(transaction._id, replicationResult.replicatedTo);
    }

    res.json({
      success: true,
      message: 'Withdrawal successful',
      transaction: transaction.toJSON(),
      newBalance: user.balance - amount,
      processedBy: selectedNode.id,
      lamportTimestamp: lamportTime,
      replication: replicationResult
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Withdrawal failed',
      error: error.message 
    });
  }
};

// Transfer money
exports.transfer = async (req, res) => {
  try {
    const { toAccount, amount } = req.body;
    const userId = req.user.userId;

    // Validation
    if (!toAccount || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid transfer details' 
      });
    }

    // Get sender
    const sender = await UserModel.findById(userId);
    if (!sender) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sender not found' 
      });
    }

    // Get recipient
    const recipient = await UserModel.findOne({ accountNumber: toAccount });
    if (!recipient) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recipient account not found' 
      });
    }

    // Check sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Select node using load balancer
    const loadBalancer = getLoadBalancer();
    const selectedNode = loadBalancer.selectNode();

    // Get Lamport clock
    const simulator = getSimulator();
    const clock = simulator.clockManager.getClock(selectedNode.id);
    const lamportTime = clock.tick();

    // Create transaction
    const transaction = await TransactionModel.create({
      userId,
      type: 'transfer',
      amount,
      fromAccount: sender.accountNumber,
      toAccount: recipient.accountNumber,
      nodeId: selectedNode.id,
      lamportTimestamp: lamportTime,
      status: 'completed'
    });

    // Process on selected node
    selectedNode.processTransaction(transaction.toJSON());

    // Update balances
    await UserModel.updateBalance(userId, sender.balance - amount);
    await UserModel.updateBalance(recipient._id, recipient.balance + amount);

    // Replicate to backup nodes
    const replicationManager = getReplicationManager();
    const replicationResult = await replicationManager.replicateTransaction(transaction.toJSON());

    // Update transaction replication status
    if (replicationResult.success) {
      await TransactionModel.updateReplication(transaction._id, replicationResult.replicatedTo);
    }

    res.json({
      success: true,
      message: 'Transfer successful',
      transaction: transaction.toJSON(),
      newBalance: sender.balance - amount,
      processedBy: selectedNode.id,
      lamportTimestamp: lamportTime,
      replication: replicationResult
    });

  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Transfer failed',
      error: error.message 
    });
  }
};

// Get balance
exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      balance: user.balance,
      accountNumber: user.accountNumber
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get balance',
      error: error.message 
    });
  }
};

// Get transaction history
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transactions = await TransactionModel.findByUser(userId);

    res.json({
      success: true,
      count: transactions.length,
      transactions: transactions.map(t => t.toJSON())
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transactions',
      error: error.message 
    });
  }
};

// Get all transactions (admin only)
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await TransactionModel.findAll();

    res.json({
      success: true,
      count: transactions.length,
      transactions: transactions.map(t => t.toJSON())
    });

  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get transactions',
      error: error.message 
    });
  }
};

// Get transaction statistics (admin only)
exports.getTransactionStats = async (req, res) => {
  try {
    const stats = await TransactionModel.getStats();

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get statistics',
      error: error.message 
    });
  }
};

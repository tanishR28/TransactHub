// Transaction Model
// Handles all banking transactions with distributed system metadata

class Transaction {
  constructor(data) {
    this._id = data._id || this.generateId();
    this.userId = data.userId;
    this.type = data.type; // 'deposit', 'withdraw', 'transfer'
    this.amount = data.amount;
    this.toAccount = data.toAccount || null; // For transfers
    this.fromAccount = data.fromAccount || null;
    this.status = data.status || 'completed'; // 'pending', 'completed', 'failed'
    this.nodeId = data.nodeId; // Which node processed this
    this.lamportTimestamp = data.lamportTimestamp || 0;
    this.isReplicated = data.isReplicated || false;
    this.replicatedTo = data.replicatedTo || [];
    this.timestamp = data.timestamp || new Date();
  }

  generateId() {
    return 'txn' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  toJSON() {
    return {
      _id: this._id,
      userId: this.userId,
      type: this.type,
      amount: this.amount,
      toAccount: this.toAccount,
      fromAccount: this.fromAccount,
      status: this.status,
      nodeId: this.nodeId,
      lamportTimestamp: this.lamportTimestamp,
      isReplicated: this.isReplicated,
      replicatedTo: this.replicatedTo,
      timestamp: this.timestamp
    };
  }
}

// In-memory Transaction operations
const { getDB } = require('../config/db');

const TransactionModel = {
  async create(txnData) {
    const transaction = new Transaction(txnData);
    const db = getDB();
    db.transactions.push(transaction);
    return transaction;
  },

  async findById(id) {
    const db = getDB();
    return db.transactions.find(txn => txn._id === id);
  },

  async findByUser(userId) {
    const db = getDB();
    return db.transactions
      .filter(txn => txn.userId === userId)
      .sort((a, b) => b.timestamp - a.timestamp);
  },

  async findAll() {
    const db = getDB();
    return db.transactions.sort((a, b) => b.timestamp - a.timestamp);
  },

  async updateReplication(txnId, nodeIds) {
    const db = getDB();
    const txn = db.transactions.find(t => t._id === txnId);
    if (txn) {
      txn.isReplicated = true;
      txn.replicatedTo = nodeIds;
      return txn;
    }
    return null;
  },

  async getStats() {
    const db = getDB();
    const total = db.transactions.length;
    const byType = db.transactions.reduce((acc, txn) => {
      acc[txn.type] = (acc[txn.type] || 0) + 1;
      return acc;
    }, {});
    const totalVolume = db.transactions.reduce((sum, txn) => sum + txn.amount, 0);
    
    return { total, byType, totalVolume };
  }
};

module.exports = TransactionModel;

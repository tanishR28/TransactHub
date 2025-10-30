// Transaction Model - MongoDB with Mongoose
// Handles all banking transactions with distributed system metadata
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw', 'transfer'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  toAccount: {
    type: String,
    default: null
  },
  fromAccount: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  nodeId: {
    type: Number,
    required: true
  },
  lamportTimestamp: {
    type: Number,
    default: 0
  },
  isReplicated: {
    type: Boolean,
    default: false
  },
  replicatedTo: {
    type: [Number],
    default: []
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ nodeId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

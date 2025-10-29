// Transaction Service - API calls for banking operations
import api from './api';

const transactionService = {
  // Deposit money
  deposit: async (amount) => {
    return await api.post('/transactions/deposit', { amount });
  },

  // Withdraw money
  withdraw: async (amount) => {
    return await api.post('/transactions/withdraw', { amount });
  },

  // Transfer money
  transfer: async (toAccount, amount) => {
    return await api.post('/transactions/transfer', { toAccount, amount });
  },

  // Get balance
  getBalance: async () => {
    return await api.get('/transactions/balance');
  },

  // Get transaction history
  getHistory: async () => {
    return await api.get('/transactions/history');
  },

  // Get all transactions (admin)
  getAllTransactions: async () => {
    return await api.get('/transactions/all');
  },

  // Get transaction statistics (admin)
  getStats: async () => {
    return await api.get('/transactions/stats');
  },
};

export default transactionService;

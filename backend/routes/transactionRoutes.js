// Transaction Routes
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// User transaction routes
router.post('/deposit', authenticateToken, transactionController.deposit);
router.post('/withdraw', authenticateToken, transactionController.withdraw);
router.post('/transfer', authenticateToken, transactionController.transfer);
router.get('/balance', authenticateToken, transactionController.getBalance);
router.get('/history', authenticateToken, transactionController.getTransactions);

// Admin transaction routes
router.get('/all', authenticateToken, isAdmin, transactionController.getAllTransactions);
router.get('/stats', authenticateToken, isAdmin, transactionController.getTransactionStats);

module.exports = router;

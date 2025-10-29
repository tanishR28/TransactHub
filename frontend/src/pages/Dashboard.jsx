// Dashboard Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransactionCard from '../components/TransactionCard';
import transactionService from '../services/transactionService';
import authService from '../services/authService';
import { formatCurrency, isValidAmount } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getStoredUser());
  const [balance, setBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState({ show: false, type: '' });
  const [formData, setFormData] = useState({ amount: '', toAccount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceData = await transactionService.getBalance();
      const txnData = await transactionService.getHistory();
      setBalance(balanceData.balance);
      setRecentTransactions(txnData.transactions.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type) => {
    setError('');
    setSuccess('');

    if (!isValidAmount(formData.amount)) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      let result;
      const amount = parseFloat(formData.amount);

      if (type === 'deposit') {
        result = await transactionService.deposit(amount);
        setSuccess(`Deposit successful! New balance: ${formatCurrency(result.newBalance)}`);
      } else if (type === 'withdraw') {
        result = await transactionService.withdraw(amount);
        setSuccess(`Withdrawal successful! New balance: ${formatCurrency(result.newBalance)}`);
      } else if (type === 'transfer') {
        if (!formData.toAccount) {
          setError('Please enter recipient account number');
          return;
        }
        result = await transactionService.transfer(formData.toAccount, amount);
        setSuccess(`Transfer successful! New balance: ${formatCurrency(result.newBalance)}`);
      }

      setFormData({ amount: '', toAccount: '' });
      setTimeout(() => {
        setActionModal({ show: false, type: '' });
        fetchData();
      }, 2000);

    } catch (err) {
      setError(err.message || 'Transaction failed');
    }
  };

  const openModal = (type) => {
    setActionModal({ show: true, type });
    setError('');
    setSuccess('');
    setFormData({ amount: '', toAccount: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-200 mb-2">Current Balance</p>
              <h2 className="text-5xl font-bold">{formatCurrency(balance)}</h2>
              <p className="text-blue-200 mt-2">Account: {user?.accountNumber}</p>
            </div>
            <div className="text-6xl"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button onClick={() => openModal('deposit')} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-lg shadow-md transition">
             Deposit Money
          </button>
          <button onClick={() => openModal('withdraw')} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-lg shadow-md transition">
             Withdraw Money
          </button>
          <button onClick={() => openModal('transfer')} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg shadow-md transition">
             Transfer Funds
          </button>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Recent Transactions</h2>
            <button onClick={() => navigate('/transactions')} className="text-blue-600 hover:underline">
              View All 
            </button>
          </div>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No transactions yet</p>
            ) : (
              recentTransactions.map(txn => <TransactionCard key={txn._id} transaction={txn} />)
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {actionModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 capitalize">{actionModal.type}</h3>
            
            {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">{success}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Amount</label>
                <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="0.00" />
              </div>

              {actionModal.type === 'transfer' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">To Account</label>
                  <input type="text" value={formData.toAccount} onChange={(e) => setFormData({...formData, toAccount: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="ACC1000002" />
                </div>
              )}

              <div className="flex space-x-4">
                <button onClick={() => handleAction(actionModal.type)} disabled={!!success} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg disabled:opacity-50">
                  Confirm
                </button>
                <button onClick={() => setActionModal({ show: false, type: '' })} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

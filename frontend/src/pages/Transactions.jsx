// Transactions Page
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransactionCard from '../components/TransactionCard';
import transactionService from '../services/transactionService';
import authService from '../services/authService';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTxn, setFilteredTxn] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [filter, transactions]);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getHistory();
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    if (filter === 'all') {
      setFilteredTxn(transactions);
    } else {
      setFilteredTxn(transactions.filter(txn => txn.type === filter));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-2xl text-gray-600">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transaction History</h1>
          <button onClick={() => fetchTransactions()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Refresh
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-4 mb-6">
          {['all', 'deposit', 'withdraw', 'transfer'].map(type => (
            <button key={type} onClick={() => setFilter(type)} className={`px-4 py-2 rounded-lg capitalize ${filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {type}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTxn.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg">
              <p className="text-gray-600 text-lg">No transactions found</p>
            </div>
          ) : (
            filteredTxn.map(txn => <TransactionCard key={txn._id} transaction={txn} />)
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{transactions.filter(t => t.type === 'deposit').length}</div>
              <div className="text-gray-600">Deposits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{transactions.filter(t => t.type === 'withdraw').length}</div>
              <div className="text-gray-600">Withdrawals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{transactions.filter(t => t.type === 'transfer').length}</div>
              <div className="text-gray-600">Transfers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;

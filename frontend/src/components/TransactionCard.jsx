// Transaction Card Component
import React from 'react';
import { formatCurrency, formatDate, getTransactionIcon, getTransactionColor } from '../utils/helpers';

const TransactionCard = ({ transaction }) => {
  const { type, amount, timestamp, nodeId, lamportTimestamp, toAccount, fromAccount, isReplicated } = transaction;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        {/* Left Section */}
        <div className="flex items-start space-x-3">
          <div className="text-3xl">{getTransactionIcon(type)}</div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-semibold text-lg capitalize ${getTransactionColor(type)}`}>
                {type}
              </span>
              {isReplicated && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Replicated
                </span>
              )}
            </div>
            <div className="text-gray-600 text-sm mt-1">
              {type === 'transfer' && (
                <div>
                  From: {fromAccount} → To: {toAccount}
                </div>
              )}
              {type === 'deposit' && <div>Account: {fromAccount}</div>}
              {type === 'withdraw' && <div>Account: {fromAccount}</div>}
            </div>
            <div className="text-gray-500 text-xs mt-2">
              {formatDate(timestamp)}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="text-right">
          <div className={`text-xl font-bold ${getTransactionColor(type)}`}>
            {type === 'withdraw' ? '-' : '+'}{formatCurrency(amount)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Node {nodeId} | Clock: {lamportTimestamp}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;

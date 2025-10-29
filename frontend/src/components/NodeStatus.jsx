// Node Status Component - Visualizes distributed nodes
import React from 'react';
import { getNodeStatusColor } from '../utils/helpers';

const NodeStatus = ({ nodes, onNodeClick }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Loading node information...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`${getNodeStatusColor(node.alive, node.isPrimary)} rounded-lg p-4 shadow-md hover:shadow-lg transition cursor-pointer`}
          onClick={() => onNodeClick && onNodeClick(node)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">
                {node.isPrimary ? '👑' : node.alive ? '🟢' : '🔴'}
              </span>
              <span className="font-bold text-lg">Node {node.id}</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-semibold ${
              node.alive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
            }`}>
              {node.alive ? 'Active' : 'Down'}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-700">Status:</span>
              <span className="font-medium">
                {node.isPrimary ? 'Primary' : 'Backup'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Requests:</span>
              <span className="font-medium">{node.requestsHandled || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Ledger Size:</span>
              <span className="font-medium">{node.ledgerSize || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Clock:</span>
              <span className="font-mono font-medium">{node.clock || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Avg Response:</span>
              <span className="font-medium">{node.responseTime || 0}ms</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NodeStatus;

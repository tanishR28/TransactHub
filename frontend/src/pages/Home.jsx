// Home Page - Landing page with login/register options
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            🏦 TransactHub
          </h1>
          <p className="text-2xl text-gray-600 mb-8">
            A Distributed Banking System built on MERN
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-12">
            Experience the power of distributed computing with real-time transaction processing,
            leader election, data replication, and fault tolerance simulation.
          </p>

          {/* CTA Buttons */}
          <div className="flex justify-center space-x-4 mb-16">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg border-2 border-blue-600 transition transform hover:scale-105"
            >
              Register
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Technical Features */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Distributed Computing Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {technicalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl">✓</span>
                  <div>
                    <span className="font-semibold text-gray-800">{feature.name}:</span>
                    <span className="text-gray-600"> {feature.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: '💳',
    title: 'Secure Banking',
    description: 'Perform deposits, withdrawals, and transfers with JWT authentication and encrypted data.'
  },
  {
    icon: '🔄',
    title: 'Distributed System',
    description: 'Experience real distributed computing with multiple virtual nodes and data replication.'
  },
  {
    icon: '📊',
    title: 'Real-time Monitoring',
    description: 'Track system health, node status, and transaction flow in real-time through admin dashboard.'
  }
];

const technicalFeatures = [
  { name: 'Client-Server Communication', desc: 'RESTful API with Express.js' },
  { name: 'Multithreading', desc: 'Async request handling simulation' },
  { name: 'Lamport Clock', desc: 'Logical clock synchronization' },
  { name: 'Leader Election', desc: 'Bully algorithm implementation' },
  { name: 'Data Replication', desc: 'Primary-backup replication strategy' },
  { name: 'Load Balancing', desc: 'Round-robin, weighted, least-connections' },
  { name: 'Fault Tolerance', desc: 'Node failure simulation and recovery' },
  { name: 'MapReduce Style', desc: 'Parallel transaction analytics' }
];

export default Home;

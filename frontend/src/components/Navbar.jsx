// Navbar Component
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getStoredUser();
  const isAdmin = authService.isAdmin();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl">🏦</span>
            <span className="font-bold text-xl">TransactHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link to="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
            <Link to="/transactions" className="hover:text-blue-200 transition">
              Transactions
            </Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200 transition">
                Admin Panel
              </Link>
            )}
            
            {/* User Menu */}
            <div className="flex items-center space-x-4 border-l border-blue-500 pl-6">
              <div className="text-sm">
                <div className="font-medium">{user?.email}</div>
                <div className="text-blue-200 text-xs">{user?.accountNumber}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-900 px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

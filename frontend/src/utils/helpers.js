// Helper Functions

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format relative time
export const formatRelativeTime = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

// Truncate account number
export const truncateAccount = (accountNumber) => {
  if (!accountNumber) return '';
  return `${accountNumber.slice(0, 3)}...${accountNumber.slice(-4)}`;
};

// Get transaction type color
export const getTransactionColor = (type) => {
  const colors = {
    deposit: 'text-green-600',
    withdraw: 'text-red-600',
    transfer: 'text-blue-600',
  };
  return colors[type] || 'text-gray-600';
};

// Get transaction type icon
export const getTransactionIcon = (type) => {
  const icons = {
    deposit: '💵',
    withdraw: '💸',
    transfer: '🔄',
  };
  return icons[type] || '💰';
};

// Get node status color
export const getNodeStatusColor = (alive, isPrimary) => {
  if (!alive) return 'bg-red-100 text-red-700';
  if (isPrimary) return 'bg-green-100 text-green-700';
  return 'bg-blue-100 text-blue-700';
};

// Validate email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate amount
export const isValidAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

// Copy to clipboard
export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
};

// Show notification (you can integrate with toast library)
export const showNotification = (message, type = 'info') => {
  console.log(`[${type.toUpperCase()}]`, message);
  // You can replace this with a toast notification library
};

export default {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  truncateAccount,
  getTransactionColor,
  getTransactionIcon,
  getNodeStatusColor,
  isValidEmail,
  isValidAmount,
  copyToClipboard,
  showNotification,
};

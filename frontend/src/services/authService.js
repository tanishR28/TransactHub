// Auth Service - Authentication API calls
import api from './api';

const authService = {
  // Register new user
  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    // Don't auto-login after registration - redirect to login page instead
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },

  // Get all users (admin)
  getAllUsers: async () => {
    return await api.get('/auth/users');
  },

  // Get stored user from localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getStoredUser();
    return user?.role === 'admin';
  },
};

export default authService;

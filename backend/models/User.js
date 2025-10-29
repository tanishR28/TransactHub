// User Model
// In a real application, this would use Mongoose schema

class User {
  constructor(data) {
    this._id = data._id || this.generateId();
    this.email = data.email;
    this.password = data.password; // Should be hashed
    this.accountNumber = data.accountNumber || this.generateAccountNumber();
    this.balance = data.balance || 0;
    this.role = data.role || 'user'; // 'user' or 'admin'
    this.createdAt = data.createdAt || new Date();
  }

  generateId() {
    return 'user' + Date.now() + Math.random().toString(36).substr(2, 9);
  }

  generateAccountNumber() {
    return 'ACC' + Math.floor(1000000 + Math.random() * 9000000);
  }

  toJSON() {
    return {
      _id: this._id,
      email: this.email,
      accountNumber: this.accountNumber,
      balance: this.balance,
      role: this.role,
      createdAt: this.createdAt
    };
  }
}

// In-memory User operations
const { getDB } = require('../config/db');

const UserModel = {
  async create(userData) {
    const user = new User(userData);
    const db = getDB();
    db.users.push(user);
    return user;
  },

  async findOne(query) {
    const db = getDB();
    return db.users.find(user => {
      if (query.email) return user.email === query.email;
      if (query._id) return user._id === query._id;
      if (query.accountNumber) return user.accountNumber === query.accountNumber;
      return false;
    });
  },

  async findById(id) {
    const db = getDB();
    return db.users.find(user => user._id === id);
  },

  async findAll() {
    const db = getDB();
    return db.users;
  },

  async updateBalance(userId, newBalance) {
    const db = getDB();
    const user = db.users.find(u => u._id === userId);
    if (user) {
      user.balance = newBalance;
      return user;
    }
    return null;
  }
};

module.exports = UserModel;

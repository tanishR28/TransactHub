// User Model - MongoDB with Mongoose
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'ACC' + Math.floor(1000000 + Math.random() * 9000000);
    }
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Method to return user without password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

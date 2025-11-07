# Admin Account Setup Guide

This guide explains how to create an admin account for the TransactHub system.

## 📋 Methods to Create Admin Account

### Method 1: Using the Admin Setup Script (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the admin creation script:
   ```bash
   node scripts/createAdmin.js
   ```

3. Enter the required information:
   - Admin email address
   - Admin password (minimum 6 characters)
   - Confirm password

4. The script will create the admin account and display the details:
   ```
   ✅ Admin account created successfully!
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📧 Email: admin@example.com
   🔢 Account Number: ACC1234567
   👑 Role: admin
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```

---

### Method 2: Using the API Endpoint (If Enabled)

⚠️ **This method is disabled by default for security.**

1. Enable admin registration in `.env`:
   ```env
   ALLOW_ADMIN_REGISTRATION=true
   ```

2. Restart the backend server

3. Make a POST request to create an admin:
   ```bash
   POST http://localhost:4000/api/auth/register-admin
   Content-Type: application/json

   {
     "email": "admin@example.com",
     "password": "your-secure-password"
   }
   ```

4. **Important:** After creating the admin, disable the endpoint:
   ```env
   ALLOW_ADMIN_REGISTRATION=false
   ```

5. Restart the server again

---

## 👤 Creating Regular User Accounts

Regular users can register through:

1. **Web Interface:**
   - Go to `/register` page
   - Fill in email and password
   - Account is created with ₹0 balance

2. **API Endpoint:**
   ```bash
   POST http://localhost:4000/api/auth/register
   Content-Type: application/json

   {
     "email": "user@example.com",
     "password": "user-password"
   }
   ```

---

## 🔑 Default Configuration

- **Starting Balance:** ₹0 for all new accounts
- **Currency:** Indian Rupees (₹)
- **Password Minimum Length:** 6 characters
- **Account Number:** Auto-generated (format: ACC1234567)

---

## 🎯 Admin Privileges

Admin accounts have access to:
- View all users
- View all transactions
- Access system statistics
- Manage distributed system nodes
- Perform leader election
- Manage load balancing strategies
- Sync system clocks

---

## 🛡️ Security Best Practices

1. ✅ Keep `ALLOW_ADMIN_REGISTRATION=false` in production
2. ✅ Use strong passwords (minimum 12 characters recommended)
3. ✅ Store admin credentials securely
4. ✅ Never commit `.env` file to version control
5. ✅ Regularly update JWT_SECRET in production
6. ✅ Enable HTTPS in production

---

## 🔍 Verifying Admin Account

1. Login with admin credentials at `/login`
2. Navigate to `/admin` to access the admin panel
3. You should see system management options

---

## ❓ Troubleshooting

### "User already exists"
- The email is already registered
- Choose a different email address

### "Admin registration is disabled"
- Check `.env` file: `ALLOW_ADMIN_REGISTRATION=true`
- Restart the backend server after changing `.env`

### "MongoDB connection failed"
- Verify `MONGO_URI` in `.env` is correct
- Check your MongoDB Atlas connection

---

## 📞 Need Help?

For issues or questions, check the main README.md or contact support.

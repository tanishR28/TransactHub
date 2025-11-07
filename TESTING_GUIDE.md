# 🚀 Complete Setup & Testing Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js installed (v16 or higher)
- ✅ MongoDB Atlas connection string in `.env` file
- ✅ All dependencies installed (`npm install`)

---

## 📦 Step 1: Install Dependencies

### **Backend:**
```powershell
cd backend
npm install
```

### **Frontend:**
```powershell
cd frontend
npm install
```

---

## 🎯 Step 2: Configure Environment

Ensure `backend/.env` has:
```env
MONGO_URI=mongodb+srv://tanishrane243:VImJvtvB4psDRQoD@tanishr1.h8qpra7.mongodb.net/transacthub
JWT_SECRET=your-secret-key-here
PORT=4000
NODE_ENV=development
ALLOW_ADMIN_REGISTRATION=false
```

---

## 🖥️ Step 3: Run the Distributed System

### **Option A: Run All at Once (Automated)**

```powershell
.\start-distributed.ps1
```

This opens 7 terminals:
- 5 for backend servers (4001-4005)
- 1 for API gateway (4000)
- 1 for frontend (5173)

### **Option B: Run Manually (Recommended for Testing)**

Open **7 separate PowerShell terminals**:

#### **Terminal 1 - Server 1:**
```powershell
cd backend
node server-node1.js
```

Expected output:
```
[dotenv] injecting env from .env
✅ MongoDB connected successfully
📦 Database: transacthub
🔄 Replica Set: Enabled (Atlas Cluster)
📖 Read Preference: Secondary Preferred
✍️  Write Concern: Majority
🌐 Connected to: tanishr1.h8qpra7.mongodb.net
🗄️  Database Name: transacthub
🔗 Mongoose connected to MongoDB
🟢 Node 1 running on http://localhost:4001
📊 Health check: http://localhost:4001/health
```

#### **Terminal 2 - Server 2:**
```powershell
cd backend
node server-node2.js
```

Expected output:
```
🟢 Node 2 running on http://localhost:4002
```

#### **Terminal 3 - Server 3:**
```powershell
cd backend
node server-node3.js
```

#### **Terminal 4 - Server 4:**
```powershell
cd backend
node server-node4.js
```

#### **Terminal 5 - Server 5:**
```powershell
cd backend
node server-node5.js
```

#### **Terminal 6 - API Gateway:**
```powershell
cd backend
node gateway.js
```

Expected output:
```
🌐 ════════════════════════════════════════════════
   API GATEWAY RUNNING ON http://localhost:4000
🌐 ════════════════════════════════════════════════

🔍 Checking for running nodes...

✅ Node 1 detected at http://localhost:4001
👑 Node 1 set as primary node
✅ Node 2 detected at http://localhost:4002
✅ Node 3 detected at http://localhost:4003
✅ Node 4 detected at http://localhost:4004
✅ Node 5 detected at http://localhost:4005

📊 Found 5 running node(s)

✅ Load balancing strategy: Round-robin
✅ Health checks: Every 5 seconds
✅ Gateway ready to accept requests
```

#### **Terminal 7 - Frontend:**
```powershell
cd frontend
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Step 4: Test the System

### **Test 1: Access the Application**

1. Open browser: http://localhost:5173
2. You should see the TransactHub homepage

### **Test 2: Create Admin Account**

```powershell
# In a new terminal
cd backend
node scripts/createAdmin.js
```

Follow prompts:
```
Enter admin email: admin@transacthub.com
Enter password: admin123
Confirm password: admin123
```

### **Test 3: Register Regular User**

1. Go to http://localhost:5173/register
2. Enter:
   - Email: `user1@test.com`
   - Password: `password123`
3. Click Register
4. Redirected to login page

### **Test 4: Login as User**

1. Go to http://localhost:5173/login
2. Enter credentials
3. Click Login
4. You should see dashboard with balance: ₹0

### **Test 5: Test Transactions**

#### **Deposit:**
1. Go to "Transactions" page
2. Select "Deposit"
3. Enter amount: `5000`
4. Click Submit
5. Balance should update to ₹5000

#### **Withdraw:**
1. Select "Withdraw"
2. Enter amount: `1000`
3. Click Submit
4. Balance should be ₹4000

#### **Transfer:**
1. Create another user account
2. Note their account number
3. Select "Transfer"
4. Enter recipient account number
5. Enter amount: `500`
6. Click Submit
7. Balance should be ₹3500

---

## 🔄 Step 5: Test Load Balancing

### **Test: See Which Server Handles Requests**

Watch the **gateway terminal**. You'll see logs like:
```
🔄 GET /api/transactions → Node 1
🔄 POST /api/transactions → Node 1 (primary)
🔄 GET /api/auth/me → Node 2
🔄 GET /api/transactions → Node 3
```

**Notice:**
- GET requests rotate through all nodes (1, 2, 3, 4, 5, 1, 2...)
- POST requests go to primary node

---

## 🧪 Step 6: Test MongoDB Replication

### **Test: Write and Read from Different Servers**

1. **Make a deposit via Server 1:**
   - Watch Terminal 1 (Server 1)
   - Make deposit of ₹1000
   - You'll see: `POST /api/transactions` in Server 1 terminal

2. **Read balance via different server:**
   - Refresh the dashboard
   - Watch gateway terminal
   - You'll see: `GET /api/auth/me → Node 2` (or 3, 4, 5)
   - Balance shows ₹1000 ✓

3. **This proves:**
   - Write went to one server (Server 1)
   - Read came from different server (Server 2)
   - Data is replicated via MongoDB!

---

## 👑 Step 7: Test Leader Election

### **Test: Rotate Primary Node**

1. **Login as admin:**
   - Email: `admin@transacthub.com`
   - Password: `admin123`

2. **Go to Admin Panel**

3. **Check current primary:**
   - Look at "System Stats" box
   - Note: "Primary Node: Node 1"

4. **Click "Elect Leader" button**

5. **Observe:**
   - Gateway terminal shows: `👑 Leadership transferred to Node 2`
   - Admin panel updates: "Primary Node: Node 2"

6. **Click again:**
   - Primary rotates to Node 3

7. **Keep clicking:**
   - Primary rotates: 1 → 2 → 3 → 4 → 5 → 1 → 2...

---

## 🛑 Step 8: Test Fault Tolerance

### **Test: Stop a Server**

1. **Check active servers in admin panel:**
   - Shows: "5 / 5 Active Nodes"

2. **Stop Server 3:**
   - Go to Terminal 3 (Server 3)
   - Press `Ctrl + C`

3. **Watch gateway terminal:**
   - After 5 seconds: `❌ Node 3 is down`

4. **Check admin panel:**
   - Auto-refreshes (every 3 seconds)
   - Now shows: "4 / 5 Active Nodes"
   - Server 3 shows as "🔴 Down"

5. **Make a transaction:**
   - Still works! Gateway routes to healthy servers

6. **Restart Server 3:**
   ```powershell
   node server-node3.js
   ```

7. **Watch gateway:**
   - After 5 seconds: `✅ Node 3 is now online`
   - Admin panel shows: "5 / 5 Active Nodes"

---

## 📊 Step 9: Test Admin Features

### **Test: View All Transactions**

1. In Admin Panel, click **"View All Transactions"**
2. See all transactions from all users
3. Each transaction shows which node processed it

### **Test: View Transaction Statistics**

1. Click **"Transaction Statistics"**
2. See:
   - Total transactions
   - Deposits count
   - Withdrawals count
   - Transfers count
   - Total volume

### **Test: View All Users**

1. Click **"View All Users"**
2. See table with:
   - Email
   - Account number
   - Balance
   - Role (admin/user)
   - Created date

### **Test: View Replication Status**

1. Scroll to **"Database Replication Status"**
2. See:
   - Active servers count
   - Primary server
   - Each server's status
   - Sync status
   - Replication info

---

## 🔍 Step 10: Verify MongoDB Replication

### **Test: Check MongoDB Atlas**

1. **Go to:** https://cloud.mongodb.com
2. **Login** with your credentials
3. **Select your cluster:** `tanishr1`
4. **Click "Metrics"**
5. **Observe:**
   - Replica Set Status
   - Primary node
   - Secondary nodes
   - Replication lag (should be < 1 second)
   - Operations/second

### **Test: Read Preference in Action**

1. **Check Server 1 terminal:**
   - Look for MongoDB connection logs
   - See: `📖 Read Preference: Secondary Preferred`

2. **Make 10 transactions:**
   - Watch which servers handle reads
   - Reads distributed across Node 1-5
   - Writes always go to primary

3. **Check MongoDB Atlas Metrics:**
   - See operations distributed across replica set

---

## 🎯 Step 11: Performance Testing

### **Test: Concurrent Requests**

1. **Open 5 browser tabs**

2. **In each tab:**
   - Login with different users
   - Make transactions simultaneously

3. **Watch gateway terminal:**
   ```
   🔄 POST /api/transactions → Node 1
   🔄 POST /api/transactions → Node 1
   🔄 POST /api/transactions → Node 1
   🔄 GET /api/transactions → Node 2
   🔄 GET /api/transactions → Node 3
   ```

4. **Notice:**
   - All writes to primary (Node 1)
   - Reads distributed (Nodes 2-5)
   - All requests succeed
   - No conflicts

---

## 📈 Step 12: Monitor System Health

### **Check Health Endpoints:**

#### **Gateway Health:**
```powershell
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "healthy",
  "gateway": true,
  "totalNodes": 5,
  "activeNodes": 5,
  "primaryNode": 1,
  "nodes": [
    {
      "id": 1,
      "alive": true,
      "responseTime": 15,
      "requestCount": 42,
      "isPrimary": true
    },
    ...
  ]
}
```

#### **Individual Server Health:**
```powershell
curl http://localhost:4001/health
curl http://localhost:4002/health
curl http://localhost:4003/health
```

---

## 🧹 Step 13: Clean Shutdown

### **Stop All Services Gracefully:**

1. **Stop Frontend (Terminal 7):**
   - Press `Ctrl + C`

2. **Stop Gateway (Terminal 6):**
   - Press `Ctrl + C`
   - See: `🔴 Gateway shutting down...`

3. **Stop Each Server (Terminals 1-5):**
   - Press `Ctrl + C` in each
   - See: `🔴 Node X shutting down...`
   - See: `🛑 MongoDB connection closed`

---

## ✅ Expected Results Summary

After all tests, you should observe:

### **✓ Multi-Server Architecture:**
- 5 independent backend servers running
- Each server connects to MongoDB
- API Gateway load balances requests

### **✓ MongoDB Replication:**
- Writes go to MongoDB Primary
- Reads distributed to MongoDB Secondaries
- `w: 'majority'` ensures data safety
- Automatic failover if MongoDB Primary fails

### **✓ Application Replication:**
- All servers share same MongoDB database
- Data instantly available across all servers
- Write to Server 1, read from Server 5 ✓

### **✓ Load Balancing:**
- Round-robin distribution
- GET requests: All servers
- POST requests: Primary server only
- Even distribution of load

### **✓ Leader Election:**
- Rotates primary node
- Ring rotation algorithm
- Each server gets a turn as primary

### **✓ Fault Tolerance:**
- Stop any server → system continues
- Gateway detects failures (5s)
- Auto-routes to healthy servers
- Restart server → auto-detected

### **✓ Admin Features:**
- View all transactions
- View all users
- System statistics
- Replication status
- Server monitoring

---

## 🚨 Troubleshooting

### **"Cannot connect to MongoDB"**
```powershell
# Check .env file
cat backend\.env

# Ensure MONGO_URI is correct
# Test connection:
node -e "require('mongoose').connect('YOUR_URI').then(() => console.log('OK'))"
```

### **"Port already in use"**
```powershell
# Find process using port 4001
netstat -ano | findstr :4001

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different ports
```

### **"Gateway can't find servers"**
```powershell
# Ensure servers are running first
# Then start gateway
# Check firewall isn't blocking localhost
```

### **"Frontend can't connect to backend"**
```powershell
# Check gateway is running on port 4000
curl http://localhost:4000/health

# Check frontend .env
# VITE_API_URL should be http://localhost:4000/api
```

---

## 📚 What You've Built

🎉 **Congratulations!** You now have:

### **Architecture:**
- ✅ Distributed banking system with 5 servers
- ✅ API Gateway load balancer
- ✅ MongoDB Atlas 3-node replica set
- ✅ Real-time data replication
- ✅ Automatic failover
- ✅ Leader election
- ✅ Fault tolerance
- ✅ Admin monitoring panel

### **Technologies:**
- **Backend:** Node.js, Express.js
- **Frontend:** React, Vite, Tailwind CSS
- **Database:** MongoDB Atlas (Replica Set)
- **Auth:** JWT
- **Architecture:** Microservices, Load Balancing

### **Features:**
- User registration & authentication
- Deposits, withdrawals, transfers
- Transaction history
- Real-time balance updates
- Admin dashboard
- System monitoring
- Health checks
- Distributed request handling

---

## 🎓 Next Steps

1. ✅ **Add more features:**
   - Transaction limits
   - Account statements
   - Email notifications
   - Two-factor authentication

2. ✅ **Improve monitoring:**
   - Prometheus metrics
   - Grafana dashboards
   - Alert system

3. ✅ **Deploy to cloud:**
   - Azure/AWS/GCP
   - Docker containers
   - Kubernetes orchestration

4. ✅ **Add more tests:**
   - Unit tests
   - Integration tests
   - Load testing

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify all prerequisites
3. Check terminal logs for errors
4. Ensure MongoDB connection is working
5. Verify ports are not in use

---

## 🎯 Quick Reference

### **URLs:**
- Frontend: http://localhost:5173
- API Gateway: http://localhost:4000
- Server 1: http://localhost:4001
- Server 2: http://localhost:4002
- Server 3: http://localhost:4003
- Server 4: http://localhost:4004
- Server 5: http://localhost:4005

### **Commands:**
```powershell
# Start distributed system
.\start-distributed.ps1

# Create admin
node scripts/createAdmin.js

# Check health
curl http://localhost:4000/health

# Stop all (if using automated script)
# Close the main PowerShell window
```

**Happy Testing! 🚀**

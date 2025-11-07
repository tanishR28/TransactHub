# 🏦 TransactHub - Distributed Banking System

A production-grade **distributed banking system** implementing real-world distributed computing concepts with actual multi-server architecture, MongoDB replica sets, and automatic failover.

## 🌟 Key Features

### 🏦 Core Banking
- User authentication & authorization (JWT)
- Deposits, withdrawals, and transfers
- Real-time balance updates across all servers
- Transaction history with distributed timestamps
- Multi-user concurrent transaction handling
- Currency support: Indian Rupees (INR)

### 🌐 Distributed Architecture
- **5 Independent Backend Servers** (ports 4001-4005)
- **API Gateway Load Balancer** (port 4000)
- **MongoDB Atlas Replica Set** (3-node cluster)
- **Round-robin Load Distribution**
- **Dynamic Leader Election** (Ring Rotation)
- **Automatic Failover & Recovery**
- **Real-time Health Monitoring** (5-second intervals)

### 🔄 Database Replication
- **MongoDB Atlas Replica Sets** with automatic failover
- **Write Concern: Majority** - Data written to 2+ nodes
- **Read Preference: Secondary Preferred** - Distributed reads
- **Automatic Retry** on network failures
- **99.995% Uptime SLA**

### 👑 Admin Features
- System monitoring dashboard
- View all transactions across all users
- Transaction statistics and analytics
- User management
- Server status monitoring
- Replication status tracking
- Leader election control

## � Documentation

- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete setup and testing instructions
- **[DISTRIBUTED_SETUP.md](DISTRIBUTED_SETUP.md)** - Distributed system architecture guide
- **[MONGODB_REPLICATION.md](MONGODB_REPLICATION.md)** - MongoDB replication details
- **[ADMIN_SETUP.md](ADMIN_SETUP.md)** - Admin account creation guide
- **[DISTRIBUTED_FEATURES.md](DISTRIBUTED_FEATURES.md)** - Feature explanations

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- MongoDB Atlas account
- PowerShell (Windows)

### Option 1: Automated Start (All Services)
```bash
.\start-distributed.ps1

```

Server runs on http://localhost:4000### Distributed Computing Features- backend/ Express API + simulator



### Frontend- frontend/ Vite React UI (dashboard + admin)

```bash

cd frontend#### 1. **Client-Server Communication**

npm install

npm run dev- RESTful API architectureRun

```

Frontend runs on http://localhost:5173- Server-Sent Events (SSE) for real-time updatesBackend



### Demo Accounts- CORS-enabled for cross-origin requests```bash

- **User**: user1@bank.com / password123

- **User**: user2@bank.com / password123  cd backend

- **Admin**: admin@bank.com / admin123

#### 2. **Multithreading & Concurrency**npm i

## 📁 Project Structure

- Parallel transaction processing across multiple nodesnpm run dev

See code for complete structure with:

- Backend: server.js, routes/, controllers/, models/, utils/- Concurrent connection handling```

- Frontend: pages/, components/, services/, styles/

- Thread-safe data structures

## 🎯 Testing

Frontend

1. **Banking**: Login → Dashboard → Deposit/Withdraw/Transfer

2. **Leader Election**: Admin Panel → Trigger Election#### 3. **Clock Synchronization**```bash

3. **Fault Tolerance**: Admin Panel → Click node to fail/recover

4. **Load Balancing**: Admin Panel → Change strategy- **Lamport Logical Clocks** - Event ordering across distributed nodescd frontend



## 📚 Learn More- **Cristian's Algorithm** - Clock synchronization with RTT compensationnpm i



This project demonstrates distributed computing concepts:- **Berkeley Algorithm** - Distributed time averagingnpm run dev

- Client-Server Communication

- Multithreading Simulation```

- Clock Synchronization  

- Leader Election#### 4. **Leader Election**

- Data Replication

- Load Balancing- **Bully Algorithm** - Highest ID node becomes leaderBackend: http://localhost:4000

- Fault Tolerance

- **Ring Algorithm** - Token-based electionFrontend: http://localhost:5173

Built with: React, Node.js, Express, Tailwind CSS

- Automatic failover when leader fails

Key API

#### 5. **Data Replication**- GET /api/stats → strategy + node summaries

- **Primary-Backup Model** - Leader handles writes, followers replicate- POST /api/transaction { type, from, to, amount }

- Asynchronous replication to backup nodes- POST /api/strategy { strategy } roundrobin|random|least|weighted

- Consistency guarantees across all nodes- POST /api/election { algorithm } bully|ring

- POST /api/nodes/:id/toggle → start/stop node

#### 6. **Load Balancing**- GET /api/events → SSE (log, replicate, election)

- **Round Robin** - Sequential distribution

- **Random** - Random node selectionNotes

- **Least Connections** - Route to least loaded node- Simulator starts 3 nodes; node 3 is initial leader.

- **Weighted** - Performance-based routing- Followers replicate after leader applies an operation.

- Elections auto-trigger if the leader is toggled down.

#### 7. **Fault Tolerance**- Weighted LB uses 1/avgResponse as weight.

- Node failure detection and recovery

- Automatic leader re-election

- Transaction retry mechanisms
- Graceful degradation

#### 8. **Distributed Analytics (MapReduce-style)**
- Transaction volume analysis by hour
- User spending pattern analysis
- Parallel computation across datasets
- Real-time dashboard generation

#### 9. **Fraud Detection**
- Real-time transaction monitoring
- Pattern-based fraud detection rules
- Risk scoring system
- Batch analysis for historical patterns

### Geographic Distribution
- 4 distributed nodes across regions:
  - 🌎 US-EAST
  - 🌎 US-WEST
  - 🌍 EU-WEST
  - 🌏 ASIA-EAST

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load Balancer  │ ◄── Strategies: RR, Random, Least, Weighted
└────────┬────────┘
         │
    ┌────┴─────────────┬──────────┬──────────┐
    ▼                  ▼          ▼          ▼
┌────────┐        ┌────────┐ ┌────────┐ ┌────────┐
│ Node 1 │        │ Node 2 │ │ Node 3 │ │ Node 4 │
│US-EAST │        │US-WEST │ │EU-WEST │ │ASIA-E  │
└────────┘        └────────┘ └────────┘ └────────┘
    │                  │          │          │
    └──────────────────┴──────────┴──────────┘
                       │
                  Replication
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:4000`

2. **Start Frontend**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Demo Accounts

**Regular User:**
- Email: `user1@bank.com`
- Password: `password123`
- Account: ACC1000001

**Another User:**
- Email: `user2@bank.com`
- Password: `password123`
- Account: ACC1000002

**Admin:**
- Email: `admin@bank.com`
- Password: `admin123`
- Full system access

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Banking Operations
- `POST /api/banking/deposit` - Deposit money
- `POST /api/banking/withdraw` - Withdraw money
- `POST /api/banking/transfer` - Transfer between accounts
- `GET /api/banking/transactions` - Get transaction history
- `GET /api/banking/balance` - Get account balance

### Admin Operations
- `GET /api/admin/users` - List all users
- `GET /api/admin/transactions` - All transactions
- `GET /api/admin/fraud-alerts` - Fraud detection alerts
- `GET /api/admin/analytics/dashboard` - System analytics

### Distributed System Control
- `GET /api/nodes` - List all cluster nodes
- `POST /api/nodes/:id/toggle` - Start/stop node (Admin only)
- `POST /api/election` - Trigger leader election (Admin only)
- `POST /api/strategy` - Change load balancing strategy (Admin only)
- `GET /api/stats` - System statistics

### Clock Synchronization
- `POST /api/clock/cristian` - Simulate Cristian's algorithm
- `POST /api/clock/berkeley` - Simulate Berkeley algorithm

## 🔧 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **uuid** - Unique ID generation
- **Server-Sent Events** - Real-time updates

### Frontend
- **React** - UI library
- **Recharts** - Data visualization
- **Fetch API** - HTTP requests

## 📊 Key Features Demonstrated

### 1. Distributed Transaction Processing
All transactions are processed through the distributed cluster with:
- Automatic load balancing
- Primary-backup replication
- Lamport clock synchronization
- Fault-tolerant execution

### 2. Real-time Monitoring
- Live event stream of all system operations
- Node health status
- Transaction processing metrics
- Fraud detection alerts

### 3. Fault Tolerance Testing
- Toggle nodes on/off to simulate failures
- Automatic leader re-election
- Transaction continuity during failures
- Data consistency verification

### 4. Performance Analytics
- Hourly transaction volume charts
- User spending analysis
- System performance metrics
- Parallel computation demonstrations

## 🧪 Testing Distributed Features

### Test Leader Election
1. Login as admin (`admin@bank.com` / `admin123`)
2. Go to Admin Dashboard
3. Stop the current leader node (marked with 👑)
4. Observe automatic election of new leader

### Test Load Balancing
1. Make multiple transactions
2. Observe distribution across nodes
3. Change load balancing strategy (Admin only)
4. Compare distribution patterns

### Test Fault Tolerance
1. Stop one or more nodes
2. Continue making transactions
3. Observe system continues operating
4. Restart nodes and verify data consistency

### Test Fraud Detection
1. Make large transaction (>$100,000)
2. Make multiple rapid transactions
3. Observe fraud alerts in admin dashboard
4. Check risk scores and recommendations

## 📈 System Metrics

The system tracks:
- Total transactions processed
- Transaction success/failure rates
- Average response times per node
- Active connections per node
- Geographic distribution of processing
- Fraud detection accuracy

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Role-based Access** - User/Admin separation
- **Transaction Validation** - Balance checks
- **Fraud Detection** - Real-time monitoring

## 🌐 Distributed Computing Concepts Implemented

✅ Client-Server Communication  
✅ Multithreading & Concurrency  
✅ Lamport Logical Clocks  
✅ Cristian's Clock Synchronization  
✅ Berkeley Clock Synchronization  
✅ Bully Leader Election  
✅ Ring Leader Election  
✅ Primary-Backup Replication  
✅ Load Balancing (4 strategies)  
✅ Fault Tolerance & Recovery  
✅ MapReduce-style Analytics  
✅ Parallel Computation  
✅ Distributed Fraud Detection  
✅ Real-time Event Streaming  

## 📝 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Project Structure

```
TransactHub/
├── backend/
│   ├── src/
│   │   ├── server.js              # Main server
│   │   ├── sse.js                 # Server-Sent Events
│   │   ├── services/
│   │   │   ├── auth.js            # Authentication service
│   │   │   ├── transactionService.js  # Transaction processing
│   │   │   ├── fraudDetection.js  # Fraud detection
│   │   │   └── analytics.js       # Analytics & MapReduce
│   │   ├── middleware/
│   │   │   └── auth.js            # Auth middleware
│   │   └── sim/
│   │       ├── cluster.js         # Cluster management
│   │       ├── node.js            # Node implementation
│   │       ├── lamportClock.js    # Logical clocks
│   │       └── loadBalancer.js    # Load balancing
│   └── package.json
└── frontend/
    ├── src/
    │   ├── App.jsx               # Main React app
    │   └── main.jsx
    └── package.json
```

---

**Note:** This is a demonstration system for educational purposes showcasing distributed computing concepts. For production use, additional security measures, persistent storage, and comprehensive testing would be required.

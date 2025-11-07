# 🌐 Distributed System Setup Guide

This guide explains how to run TransactHub as a **real distributed system** with 5 separate backend servers and an API gateway.

---

## 🏗️ Architecture Overview

```
                        ┌─────────────────┐
                        │   Frontend      │
                        │  (Port 5173)    │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │   API Gateway   │
                        │   (Port 4000)   │
                        │  Load Balancer  │
                        └────────┬────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │         │         │         │         │         │
   ┌────▼───┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
   │ Node 1 │ │Node 2 │ │Node 3 │ │Node 4 │ │Node 5 │
   │ :4001  │ │ :4002 │ │ :4003 │ │ :4004 │ │ :4005 │
   └───┬────┘ └───┬───┘ └───┬───┘ └───┬───┘ └───┬───┘
       │          │         │         │         │
       └──────────┴─────────┴─────────┴─────────┘
                         │
                  ┌──────▼──────┐
                  │   MongoDB   │
                  │   Atlas     │
                  └─────────────┘
```

---

## 🚀 Quick Start (Automated)

### **Option 1: Run All Services with PowerShell Script**

```powershell
.\start-distributed.ps1
```

This will open **7 separate terminal windows**:
- 5 terminals for backend nodes (ports 4001-4005)
- 1 terminal for API gateway (port 4000)
- 1 terminal for frontend (port 5173)

---

## 🔧 Manual Setup (Step by Step)

### **Step 1: Start All Backend Nodes**

Open **5 separate PowerShell terminals** and run:

**Terminal 1 - Node 1:**
```powershell
cd backend
node server-node1.js
```

**Terminal 2 - Node 2:**
```powershell
cd backend
node server-node2.js
```

**Terminal 3 - Node 3:**
```powershell
cd backend
node server-node3.js
```

**Terminal 4 - Node 4:**
```powershell
cd backend
node server-node4.js
```

**Terminal 5 - Node 5:**
```powershell
cd backend
node server-node5.js
```

---

### **Step 2: Start API Gateway**

Open a **new PowerShell terminal**:

```powershell
cd backend
node gateway.js
```

---

### **Step 3: Start Frontend**

Open a **new PowerShell terminal**:

```powershell
cd frontend
npm run dev
```

---

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React web application |
| **API Gateway** | http://localhost:4000 | Load balancer (your app connects here) |
| **Node 1** | http://localhost:4001 | Direct access to Node 1 |
| **Node 2** | http://localhost:4002 | Direct access to Node 2 |
| **Node 3** | http://localhost:4003 | Direct access to Node 3 |
| **Node 4** | http://localhost:4004 | Direct access to Node 4 |
| **Node 5** | http://localhost:4005 | Direct access to Node 5 |

---

## 🔍 Health Checks

Check status of all nodes:
```
GET http://localhost:4000/health
```

Response:
```json
{
  "status": "healthy",
  "gateway": true,
  "nodes": [
    { "id": 1, "alive": true, "responseTime": 15, "requestCount": 42 },
    { "id": 2, "alive": true, "responseTime": 12, "requestCount": 38 },
    { "id": 3, "alive": false, "responseTime": 0, "requestCount": 0 },
    { "id": 4, "alive": true, "responseTime": 18, "requestCount": 35 },
    { "id": 5, "alive": true, "responseTime": 14, "requestCount": 40 }
  ],
  "primaryNode": 1
}
```

Check individual node:
```
GET http://localhost:4001/health
GET http://localhost:4002/health
...etc
```

---

## ⚙️ How It Works

### **API Gateway (Load Balancer)**

- **Round-robin load balancing** - Distributes requests evenly across all nodes
- **Health monitoring** - Checks node health every 5 seconds
- **Automatic failover** - Routes to healthy nodes if one fails
- **Primary node routing** - Write operations (POST/PUT/DELETE) go to primary node
- **Read distribution** - GET requests distributed across all nodes

### **Backend Nodes**

- Each node runs **independently** on its own port
- All nodes connect to the **same MongoDB database**
- Each request is tagged with the node ID that processed it
- Nodes can be stopped/started independently

### **Features**

✅ **True distributed system** - Real separate processes
✅ **Fault tolerance** - System continues if nodes fail
✅ **Load balancing** - Requests distributed evenly
✅ **Scalability** - Can add more nodes easily
✅ **Real leader election** - Not just simulated

---

## 🧪 Testing the Distributed System

### **Test Load Balancing:**

Make multiple requests and check which node handles each:

```bash
curl http://localhost:4000/api/system/status
```

Check the response headers:
```
X-Served-By-Node: 3
X-Response-Time: 15ms
X-Primary-Node: 1
```

### **Test Fault Tolerance:**

1. Stop Node 3 (close its terminal)
2. Make requests to gateway
3. Requests will automatically route to other nodes
4. Check health endpoint - Node 3 will show as `"alive": false`

### **Test Primary Node:**

- Write operations (create transaction, register user) always go to primary
- Read operations (view transactions) distributed across all nodes

---

## 🛑 Stopping the System

### **Automated:**
Close all terminal windows opened by `start-distributed.ps1`

### **Manual:**
In each terminal, press `Ctrl + C` to stop the service

---

## 📊 Monitoring

Watch the terminal logs to see:
- Which node processes each request
- Load distribution
- Node health status
- Response times
- Failover events

---

## 🔄 Switching Between Simulated and Distributed

### **Use Simulated (Current):**
```powershell
.\start-system.ps1
```
- Single backend process
- Simulated nodes
- Easier for development

### **Use Distributed (New):**
```powershell
.\start-distributed.ps1
```
- 5 separate backend processes
- Real distributed system
- Production-like setup

---

## 🐛 Troubleshooting

### **"Port already in use"**
```powershell
# Find what's using the port
netstat -ano | findstr :4001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **"Cannot connect to MongoDB"**
- Check `.env` file has correct `MONGO_URI`
- Verify MongoDB Atlas allows connections

### **"Node not responding"**
- Check if node terminal shows errors
- Restart the specific node
- Check health endpoint

---

## 📚 Learn More

- [DISTRIBUTED_FEATURES.md](DISTRIBUTED_FEATURES.md) - Features explanation
- [ADMIN_SETUP.md](ADMIN_SETUP.md) - Admin account setup
- [README.md](README.md) - Main documentation

---

## 🎯 Next Steps

1. ✅ Start all nodes with `start-distributed.ps1`
2. ✅ Access frontend at http://localhost:5173
3. ✅ Monitor gateway at http://localhost:4000/health
4. ✅ Test failover by stopping nodes
5. ✅ Watch logs to see load distribution

Happy testing! 🚀

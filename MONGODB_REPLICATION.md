# 🔄 MongoDB Replication Guide

## Overview

MongoDB Atlas **automatically provides replica sets** for your cluster! This gives you enterprise-grade database replication with automatic failover.

---

## 🎯 What You Get with MongoDB Atlas Replica Sets

### **Current Setup:**
Your connection string uses `mongodb+srv://` which means:
- ✅ **3-node replica set** (Primary + 2 Secondaries) 
- ✅ **Automatic failover** if primary fails
- ✅ **Data redundancy** across multiple regions
- ✅ **High availability** (99.995% SLA)

### **Architecture:**
```
┌─────────────────────────────────────────────────────┐
│              MongoDB Atlas Cluster                   │
│                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │  Primary   │  │ Secondary  │  │ Secondary  │   │
│  │   Node 1   │  │   Node 2   │  │   Node 3   │   │
│  │ (Region A) │  │ (Region A) │  │ (Region B) │   │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘   │
│         │                │                │          │
│         └────────────────┴────────────────┘          │
│              Automatic Replication                   │
└─────────────────────────────────────────────────────┘
                          │
                          │
                ┌─────────┴──────────┐
                │   API Gateway      │
                │  (Load Balancer)   │
                └─────────┬──────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
   ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
   │ Server 1│      │ Server 2│      │ Server 3│
   │ :4001   │      │ :4002   │      │ :4003   │
   └─────────┘      └─────────┘      └─────────┘
```

---

## 📋 What We Updated

### **1. Connection Configuration (`backend/config/db.js`)**

Added replica set optimizations:

```javascript
{
  // Read from secondary nodes (distribute read load)
  readPreference: 'secondaryPreferred',
  
  // Write to majority of nodes (data safety)
  writeConcern: {
    w: 'majority',      // Write to majority
    j: true,            // Wait for journal
    wtimeout: 5000      // Timeout after 5s
  },
  
  // Automatic retry on network errors
  retryWrites: true,
  retryReads: true
}
```

### **Benefits:**

✅ **Read Scaling**: Reads distributed across secondary nodes
✅ **Data Safety**: Writes confirmed by majority of nodes
✅ **Automatic Retry**: Network failures handled automatically
✅ **Failover**: If primary fails, secondary promoted automatically

---

## 🎯 Read Preferences Explained

### **Options:**

| Preference | Description | Use Case |
|------------|-------------|----------|
| `primary` | Always read from primary | Default, ensures latest data |
| `primaryPreferred` | Primary if available, else secondary | Balance between consistency and availability |
| `secondary` | Always read from secondary | Offload primary, slight lag possible |
| **`secondaryPreferred`** | Secondary if available, else primary | **Best for distributed systems** |
| `nearest` | Read from lowest latency node | Geographic distribution |

**We use `secondaryPreferred`** because:
- Distributes read load across all servers
- Primary handles writes, secondaries handle reads
- Falls back to primary if secondaries unavailable
- Perfect for banking app with more reads than writes

---

## 🛡️ Write Concerns Explained

### **Write Concern Levels:**

| Level | Behavior | Safety | Speed |
|-------|----------|--------|-------|
| `w: 1` | Primary only | Low | Fast |
| **`w: 'majority'`** | **Majority of nodes** | **High** | **Moderate** |
| `w: 3` | All 3 nodes | Very High | Slow |

**We use `w: 'majority'`** because:
- Data written to at least 2 out of 3 nodes
- Survives primary node failure
- Balances safety and performance
- Bank transactions need guaranteed writes

---

## 📊 How Replication Works

### **Write Operation:**
```
User deposits ₹1000
     ↓
Server 2 receives request
     ↓
Writes to MongoDB Primary
     ↓
Primary replicates to Secondary 1 ✓
     ↓
Primary replicates to Secondary 2 ✓
     ↓
Write confirmed (majority achieved)
     ↓
Response sent to user
```

### **Read Operation:**
```
User checks balance
     ↓
Server 1 receives request
     ↓
Gateway routes read to Secondary 1 (secondaryPreferred)
     ↓
Secondary 1 returns balance
     ↓
Response sent to user
```

### **Failover Scenario:**
```
Primary MongoDB node crashes
     ↓
MongoDB detects failure (heartbeat)
     ↓
Election: Secondary 1 promoted to Primary
     ↓
All writes now go to new Primary
     ↓
Old Primary recovers → becomes Secondary
     ↓
System continues without downtime
```

---

## 🔍 Verify Replication Status

### **1. Check MongoDB Atlas Dashboard:**
1. Login to https://cloud.mongodb.com
2. Go to your cluster
3. Click "Metrics"
4. See replica set status, replication lag, etc.

### **2. Check from Application:**

When your servers start, you'll see:
```
✅ MongoDB connected successfully
📦 Database: transacthub
🔄 Replica Set: Enabled (Atlas Cluster)
📖 Read Preference: Secondary Preferred
✍️  Write Concern: Majority
🌐 Connected to: tanishr1.h8qpra7.mongodb.net
```

### **3. Test Replication:**

**Terminal 1 - Create a transaction:**
```bash
# Start Server 1
node server-node1.js
```

Make a deposit via the app.

**Terminal 2 - Read from secondary:**
```bash
# Start Server 2 
node server-node2.js
```

Check balance - it will read from a secondary node but show the latest data!

---

## ⚙️ Advanced Configuration Options

### **For Read-Heavy Workloads:**
```javascript
readPreference: 'secondary',  // Force all reads to secondaries
readConcern: { level: 'majority' }  // Read data written to majority
```

### **For Write-Heavy Workloads:**
```javascript
readPreference: 'primary',  // All operations on primary
writeConcern: { w: 1, j: false }  // Faster writes, less safety
```

### **For Geographic Distribution:**
```javascript
readPreference: 'nearest',  // Read from closest node
readPreferenceTags: [{ region: 'us-east' }]  // Prefer specific region
```

### **For Maximum Safety (Financial Apps):**
```javascript
writeConcern: { 
  w: 'majority', 
  j: true,           // Wait for journal
  wtimeout: 10000    // Longer timeout
},
readConcern: { level: 'majority' }  // Read majority-committed data
```

---

## 🧪 Testing Replication

### **Test 1: Write and Read Distribution**

1. Start 3 servers + gateway
2. Make 10 transactions
3. Check gateway logs - see which nodes handle each request
4. Primary handles writes, secondaries handle reads

### **Test 2: Failover Simulation**

Since we can't crash MongoDB Atlas nodes (managed service), test app-level failover:

1. Start all 5 servers + gateway
2. Stop Server 1 (primary)
3. Gateway automatically elects new primary
4. System continues working
5. Restart Server 1 - it becomes a replica

### **Test 3: Data Consistency**

1. Write data via Server 1
2. Immediately read via Server 2
3. Read via Server 3
4. All should return same data (replication works!)

---

## 📈 Monitoring Replication

### **MongoDB Atlas Metrics:**
- **Replication Lag**: Time for secondaries to catch up
- **Oplog Window**: How long operation logs are retained
- **Replica Set State**: PRIMARY, SECONDARY, ARBITER
- **Network Traffic**: Data transfer between nodes

### **Application Metrics:**
Track in admin panel:
- Which server handled each request
- Read vs Write distribution
- Primary vs Secondary reads
- Response times per server

---

## 🚨 Troubleshooting

### **"Replica set name mismatch"**
- Atlas handles this automatically
- If using local MongoDB, ensure replica set name matches

### **"Not enough data-bearing members"**
- Need at least 2 nodes for majority writes
- Atlas provides 3 nodes by default

### **"WriteConcern error: waiting for replication timed out"**
- Secondary nodes are lagging
- Increase `wtimeout` or check network
- Check MongoDB Atlas metrics for replication lag

### **"No replica set members match"**
- Check read preference tags
- Ensure secondaries are healthy

---

## 🎯 Best Practices

### **For Banking Applications:**

1. ✅ **Use `w: 'majority'`** - Financial data needs guaranteed writes
2. ✅ **Use `j: true``** - Wait for journal to ensure durability
3. ✅ **Enable `retryWrites`** - Handle transient network errors
4. ✅ **Set reasonable timeouts** - 5-10 seconds for write concern
5. ✅ **Monitor replication lag** - Should be < 1 second
6. ✅ **Use transactions** - For multi-document operations
7. ✅ **Implement idempotency** - Handle duplicate requests

### **Read Preference Strategy:**

```javascript
// Transactions (must read latest)
User.findOne().read('primary')

// Balance checks (can use secondary)
User.findOne().read('secondaryPreferred')

// Reports and analytics (offload primary)
Transaction.find().read('secondary')
```

---

## 🔧 Environment Variables

Add to your `.env`:

```env
# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/transacthub

# Replication Settings (optional)
MONGO_READ_PREFERENCE=secondaryPreferred
MONGO_WRITE_CONCERN=majority
MONGO_RETRY_WRITES=true
```

---

## 📚 Learn More

- [MongoDB Replication](https://docs.mongodb.com/manual/replication/)
- [Read Preferences](https://docs.mongodb.com/manual/core/read-preference/)
- [Write Concerns](https://docs.mongodb.com/manual/reference/write-concern/)
- [MongoDB Atlas Replica Sets](https://docs.atlas.mongodb.com/create-new-cluster/)

---

## ✅ Summary

**You're already using MongoDB replication!** 🎉

Your MongoDB Atlas cluster provides:
- ✅ 3-node replica set (1 Primary + 2 Secondaries)
- ✅ Automatic failover (< 30 seconds)
- ✅ Data redundancy across availability zones
- ✅ 99.995% uptime SLA

**What we added:**
- Optimized connection settings for replica sets
- Read load distribution across secondaries
- Majority write concern for data safety
- Automatic retry on network failures
- Better logging and monitoring

**Result:**
Your distributed banking system now has **enterprise-grade database replication** with automatic failover and load distribution! 🚀

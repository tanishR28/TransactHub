# 🏦 TransactHub - Quick Start Guide

## Start the System

### Option 1: Manual Start (Recommended for Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: PowerShell Script (Windows)

Run `start-system.ps1` to start both servers automatically.

## Access the Application

1. Open browser to: **http://localhost:5173**

2. Login with demo accounts:
   - **User:** `user1@bank.com` / `password123`
   - **Admin:** `admin@bank.com` / `admin123`

## Features to Try

### As Regular User:
1. **View Balance** - See your current account balance
2. **Make Deposit** - Add funds to your account
3. **Withdraw Money** - Remove funds
4. **Transfer Money** - Send to ACC1000002 (user2)
5. **View Transactions** - See your transaction history

### As Admin:
1. **View All Users** - See all bank customers
2. **System Analytics** - View transaction charts and statistics
3. **Cluster Control**:
   - Stop/Start nodes to test fault tolerance
   - Trigger leader election (Bully or Ring algorithm)
   - Change load balancing strategy
4. **Fraud Detection** - Review suspicious transactions
5. **Real-time Monitoring** - Watch system events

## Testing Distributed Features

### 1. Test Fault Tolerance
- Login as admin
- Stop Node 4 (current leader)
- System automatically elects new leader
- Make a transaction - still works!

### 2. Test Load Balancing
- Make multiple transactions
- Watch nodes process requests
- Each node shows its processing count

### 3. Test Fraud Detection
- Try transferring $150,000
- System flags it as suspicious
- Check admin dashboard for alerts

### 4. Test Clock Synchronization
- Open browser console
- Watch Lamport clock values increment
- Each node maintains its logical clock

## System Architecture

```
Frontend (React)
    ↓
Load Balancer (Round Robin/Random/Least/Weighted)
    ↓
Distributed Cluster (4 Nodes)
    ├── Node 1 (US-EAST)
    ├── Node 2 (US-WEST)
    ├── Node 3 (EU-WEST)
    └── Node 4 (ASIA-EAST) ← Leader
```

## API Endpoints

### Banking
- POST `/api/banking/deposit` - Deposit money
- POST `/api/banking/withdraw` - Withdraw money
- POST `/api/banking/transfer` - Transfer funds
- GET `/api/banking/transactions` - Transaction history

### System
- GET `/api/nodes` - View cluster nodes
- POST `/api/election` - Trigger election
- GET `/api/stats` - System statistics

### Real-time
- GET `/api/events` - SSE stream for live updates

## Troubleshooting

### Port Already in Use
```bash
# Backend (port 4000)
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Frontend (port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Cannot Connect
- Ensure backend is running on port 4000
- Check CORS is enabled
- Verify no firewall blocking

### Transactions Failing
- Check if at least one node is active
- Verify sufficient balance
- Check browser console for errors

## Next Steps

1. **Experiment with Load Balancing**
   - Try different strategies
   - Compare performance

2. **Test Resilience**
   - Stop multiple nodes
   - Observe automatic recovery

3. **Analyze Patterns**
   - View hourly transaction charts
   - Check user spending analytics

4. **Trigger Fraud Alerts**
   - Make unusual transactions
   - Review detection patterns

## Support

For issues or questions:
- Check the main README.md
- Review source code comments
- Test with demo accounts first

---

**Happy Banking! 🏦**

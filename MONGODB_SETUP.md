# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ✅

### Steps:
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (Free tier M0)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database password
8. Update `backend/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/visitor-pass-management?retryWrites=true&w=majority
```

## Option 2: Local MongoDB

### Windows:
1. Download MongoDB from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service:
```bash
net start MongoDB
```

### If service not installed:
```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

## Option 3: Docker (Quick)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Current Status:
- ❌ Local MongoDB not running
- ✅ Backend code ready
- ✅ Frontend running on http://localhost:3001

## Quick Fix:
Use MongoDB Atlas (free) - takes 5 minutes to setup!

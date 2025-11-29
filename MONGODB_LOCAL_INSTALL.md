# MongoDB Local Installation Guide (Windows)

## Step 1: Download MongoDB

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

## Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click "Next" and "Install"
6. Wait for installation to complete

## Step 3: Verify Installation

Open Command Prompt and run:

```bash
mongod --version
```

You should see MongoDB version information.

## Step 4: Start MongoDB Service

### Method 1: As Windows Service (Recommended)
```bash
net start MongoDB
```

### Method 2: Manual Start
```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```

Note: Create the directory first if it doesn't exist:
```bash
mkdir C:\data\db
```

## Step 5: Verify MongoDB is Running

Open another Command Prompt and run:
```bash
mongosh
```

You should see MongoDB shell. Type `exit` to quit.

## Step 6: Update Backend .env

Your `.env` file should have:
```env
MONGODB_URI=mongodb://localhost:27017/visitor-pass-management
```

## Step 7: Seed Database

```bash
cd backend
npm run seed
```

## Step 8: Start Backend

```bash
npm run dev
```

## Troubleshooting

### Error: "net start MongoDB" fails

**Solution 1**: Install as service manually
```bash
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db"
net start MongoDB
```

**Solution 2**: Run MongoDB manually
```bash
mkdir C:\data\db
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
```
Keep this window open while using the app.

### Error: "mongod: command not found"

Add MongoDB to PATH:
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add: `C:\Program Files\MongoDB\Server\7.0\bin`
4. Restart Command Prompt

### Port 27017 already in use

Check if MongoDB is already running:
```bash
tasklist | findstr mongod
```

Kill the process:
```bash
taskkill /F /IM mongod.exe
```

## MongoDB Compass (GUI)

If installed, you can use MongoDB Compass to:
- View your databases visually
- Browse collections
- Run queries
- Monitor performance

Connection string: `mongodb://localhost:27017`

## Quick Commands

```bash
# Start MongoDB service
net start MongoDB

# Stop MongoDB service
net stop MongoDB

# Check if running
tasklist | findstr mongod

# Connect with shell
mongosh

# View databases (in mongosh)
show dbs

# Use your database (in mongosh)
use visitor-pass-management

# View collections (in mongosh)
show collections
```

## After Installation

1. Start MongoDB service
2. Run seed script: `npm run seed`
3. Start backend: `npm run dev`
4. Disable "Demo Mode" in frontend login
5. Login with real credentials!

## Uninstall (if needed)

1. Stop service: `net stop MongoDB`
2. Uninstall from Control Panel
3. Delete data folder: `C:\data\db`
4. Remove from PATH if added

# 🚀 Visitor Pass Management System - Quick Setup Guide

## ✅ What's Been Implemented

### Backend (Complete Core Features)
- ✅ **Database Models**: User, Visitor, Appointment, Pass, CheckLog
- ✅ **Authentication**: JWT-based auth with bcrypt password hashing
- ✅ **Authorization**: Role-based access control (Admin, Security, Employee, Visitor)
- ✅ **Services**:
  - QR Code generation
  - PDF badge generation
  - Email notifications
  - Pass management
- ✅ **Middleware**: Auth, validation, file upload, error handling
- ✅ **API Endpoints**: Authentication (register, login, get user)
- ✅ **Seed Script**: Sample data for testing

### Frontend (Basic Structure)
- ✅ React app with Vite
- ✅ Basic project structure
- 🔄 **Needs Implementation**: All UI pages and components

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Use in `.env` file

### 3. Configure Environment Variables

**Backend `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visitor-pass-management
JWT_SECRET=mySecretKey123!@#
JWT_EXPIRE=1h

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@visitorpass.com

FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database

```bash
cd backend
npm run seed
```

You'll see:
```
✅ Database seeded successfully!

Sample Login Credentials:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin:
  Email: admin@example.com
  Password: password123

Security:
  Email: security@example.com
  Password: password123

Employee:
  Email: employee@example.com
  Password: password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Start Servers

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

## 🧪 Testing the API

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"password123\"}"
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "admin@example.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test Protected Route
```bash
# Use the token from login response
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
visitor-pass-management/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Auth logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   ├── upload.js            # File uploads
│   │   └── validate.js          # Input validation
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Visitor.js           # Visitor schema
│   │   ├── Appointment.js       # Appointment schema
│   │   ├── Pass.js              # Pass schema
│   │   └── CheckLog.js          # CheckLog schema
│   ├── routes/
│   │   └── auth.js              # Auth routes
│   ├── scripts/
│   │   └── seed.js              # Database seeder
│   ├── services/
│   │   ├── emailService.js      # Email notifications
│   │   ├── passService.js       # Pass generation
│   │   ├── pdfService.js        # PDF generation
│   │   └── qrService.js         # QR code generation
│   ├── utils/
│   │   ├── jwtUtils.js          # JWT helpers
│   │   ├── passwordUtils.js     # Password hashing
│   │   └── validation.js        # Validation helpers
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API calls
│   │   ├── context/             # React context
│   │   ├── hooks/               # Custom hooks
│   │   ├── utils/               # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🎯 What's Next?

### Immediate Next Steps:
1. ✅ Test backend API with Postman or curl
2. 🔄 Implement remaining API endpoints (visitors, appointments, passes, check-in/out)
3. 🔄 Build frontend pages (login, dashboard, visitor management, QR scanner)
4. 🔄 Connect frontend to backend APIs
5. 🔄 Add styling (Tailwind CSS or Material-UI)

### API Endpoints to Implement:
- **Visitors**: POST, GET, PUT (register, list, update visitors)
- **Appointments**: POST, GET, PATCH (create, list, approve/cancel)
- **Passes**: POST, GET (generate, view passes)
- **Check-In/Out**: POST (check-in, check-out visitors)
- **Analytics**: GET (dashboard stats, reports)

### Frontend Pages to Build:
- Login page
- Dashboard (role-based)
- Visitor registration
- Appointment management
- QR code scanner
- Pass viewer
- Check-in/out interface
- Analytics dashboard

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using that port

### Email Not Sending
**Solution**: 
1. Use Gmail App Password (not regular password)
2. Enable "Less secure app access" in Gmail settings
3. Or use a service like SendGrid, Mailgun

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all dependencies are installed

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend starts without errors on port 5000
- ✅ Frontend starts without errors on port 3000
- ✅ You can login with sample credentials
- ✅ API returns valid JWT tokens
- ✅ Database contains seeded data

Happy coding! 🚀

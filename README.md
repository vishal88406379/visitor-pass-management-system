# Visitor Pass Management System

A comprehensive digital solution for managing visitor entries in organizations using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Roles
- **Admin**: Manages system, staff, and analytics
- **Security/Frontdesk**: Issues passes, scans visitors in/out
- **Employee/Host**: Can invite or approve visitors
- **Visitor**: Can pre-register, view digital pass

### Core Functionality
1. **Authentication & Authorization**: JWT-based, role-based access control
2. **Visitor Registration**: Visitor details with photo
3. **Appointments**: Pre-registration, invite, approve, notify
4. **Pass Issuance**: QR code generation and PDF badge creation
5. **Check-In/Check-Out**: QR scan logs with timestamp tracking
6. **Notifications**: Email notifications for appointments and visits
7. **Dashboard & Reports**: Analytics dashboard with search and filter capabilities

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- qrcode for QR code generation
- pdfkit for PDF badge creation
- nodemailer for email notifications

### Frontend
- React 18 with React Router v6
- Axios for API calls
- HTML5 QR Code Scanner for scanning functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/visitor-pass-management
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=1h
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=noreply@visitorpass.com
   FRONTEND_URL=http://localhost:3001
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Database Seeding

To populate the database with sample data:

```bash
cd backend
npm run seed
```

This will create sample users, visitors, appointments, and passes.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Visitors
- `POST /api/visitors` - Create visitor
- `GET /api/visitors` - Get all visitors
- `GET /api/visitors/:id` - Get visitor by ID
- `PUT /api/visitors/:id` - Update visitor
- `DELETE /api/visitors/:id` - Delete visitor

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment
- `PUT /api/appointments/:id/approve` - Approve appointment (Admin/Security)
- `PUT /api/appointments/:id/reject` - Reject appointment (Admin/Security)

### Passes
- `POST /api/passes` - Create pass (Security/Admin)
- `GET /api/passes` - Get all passes
- `GET /api/passes/:id` - Get pass by ID
- `PUT /api/passes/:id` - Update pass (Security/Admin)
- `DELETE /api/passes/:id` - Delete pass (Security/Admin)
- `GET /api/passes/:id/badge` - Download PDF badge

### Check Logs
- `POST /api/checklogs/checkin` - Check in visitor (Security/Admin)
- `POST /api/checklogs/checkout` - Check out visitor (Security/Admin)
- `GET /api/checklogs` - Get all check logs
- `GET /api/checklogs/active` - Get active visitors
- `GET /api/checklogs/:id` - Get check log by ID

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics (Admin/Security)
- `GET /api/analytics/trends` - Get visitor trends (Admin/Security)
- `GET /api/analytics/times` - Get popular visit times (Admin/Security)
- `GET /api/analytics/hosts` - Get host activity (Admin/Security)

## Project Structure

```
visitor-pass-management/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── ...
│   ├── .env
│   └── ...
└── README.md
```

## Usage

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3001` in your browser
3. Use the seeded credentials to log in:
   - Admin: admin@example.com / password123
   - Security: security@example.com / password123
   - Employee: employee@example.com / password123

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- QR code generation powered by [qrcode](https://www.npmjs.com/package/qrcode)
- PDF generation powered by [pdfkit](https://www.npmjs.com/package/pdfkit)
- Email notifications powered by [nodemailer](https://www.npmjs.com/package/nodemailer)
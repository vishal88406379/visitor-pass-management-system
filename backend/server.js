/**
 * Main server file for Visitor Pass Management System
 * Initializes Express app, connects to MongoDB, and starts the server
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Visitor Pass Management System API' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/passes', require('./routes/passes'));
app.use('/api/checklogs', require('./routes/checklogs'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/organizations', require('./routes/organizations'));

// Error handling middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

module.exports = app;

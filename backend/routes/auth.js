/**
 * Authentication Routes
 * Routes for user registration, login, and profile
 */

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, isAdmin } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.post('/register', protect, isAdmin, register); // Admin only
router.get('/me', protect, getMe);

module.exports = router;

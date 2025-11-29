/**
 * Visitor Routes
 * Routes for visitor management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  registerVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  sendOTP,
  verifyVisitorOTP,
  registerVisitorWithOTP
} = require('../controllers/visitorController');

// All authenticated users can access visitor routes
router.route('/')
  .post(protect, registerVisitor)
  .get(protect, getAllVisitors);

router.route('/:id')
  .get(protect, getVisitorById)
  .put(protect, updateVisitor)
  .delete(protect, deleteVisitor);

// Public routes for OTP verification
router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyVisitorOTP);
router.route('/register-with-otp').post(upload.single('photo'), registerVisitorWithOTP);

module.exports = router;
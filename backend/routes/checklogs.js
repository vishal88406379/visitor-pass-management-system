/**
 * CheckLog Routes
 * Routes for visitor check-in/check-out logs
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  checkInVisitor,
  checkOutVisitor,
  getAllCheckLogs,
  getCheckLogById,
  getActiveVisitors
} = require('../controllers/checkLogController');

// Security can check visitors in/out
router.route('/checkin')
  .post(protect, authorize('security', 'admin'), checkInVisitor);

router.route('/checkout')
  .post(protect, authorize('security', 'admin'), checkOutVisitor);

// View check logs
router.route('/')
  .get(protect, getAllCheckLogs);

router.route('/active')
  .get(protect, getActiveVisitors);

router.route('/:id')
  .get(protect, getCheckLogById);

module.exports = router;
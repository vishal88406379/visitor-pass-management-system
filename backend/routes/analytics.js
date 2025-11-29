/**
 * Analytics Routes
 * Routes for analytics and reporting
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  getDashboardStats,
  getVisitorTrends,
  getPopularVisitTimes,
  getHostActivity
} = require('../controllers/analyticsController');

// Admin and Security can access analytics
router.route('/dashboard')
  .get(protect, authorize('admin', 'security'), getDashboardStats);

router.route('/trends')
  .get(protect, authorize('admin', 'security'), getVisitorTrends);

router.route('/times')
  .get(protect, authorize('admin', 'security'), getPopularVisitTimes);

router.route('/hosts')
  .get(protect, authorize('admin', 'security'), getHostActivity);

module.exports = router;
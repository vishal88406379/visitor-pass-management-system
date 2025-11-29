/**
 * Pass Routes
 * Routes for pass management
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  createPass,
  getAllPasses,
  getPassById,
  updatePass,
  deletePass,
  generatePassBadge
} = require('../controllers/passController');

// Security and Admin can manage passes
router.route('/')
  .post(protect, authorize('security', 'admin'), createPass)
  .get(protect, getAllPasses);

router.route('/:id')
  .get(protect, getPassById)
  .put(protect, authorize('security', 'admin'), updatePass)
  .delete(protect, authorize('security', 'admin'), deletePass);

// Generate PDF badge for pass
router.route('/:id/badge')
  .get(protect, generatePassBadge);

module.exports = router;
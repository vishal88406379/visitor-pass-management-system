/**
 * Organization Routes
 * Routes for organization management in a multi-organization system
 */

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { 
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} = require('../controllers/organizationController');

// All routes require authentication and admin authorization
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .post(createOrganization)
  .get(getAllOrganizations);

router.route('/:id')
  .get(getOrganizationById)
  .put(updateOrganization)
  .delete(deleteOrganization);

module.exports = router;
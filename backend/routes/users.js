/**
 * User Routes
 * Routes for user management
 */

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

// Admin routes
router.route('/')
  .get(protect, isAdmin, getAllUsers);

router.route('/:id')
  .get(protect, isAdmin, getUserById)
  .put(protect, isAdmin, updateUser)
  .delete(protect, isAdmin, deleteUser);

module.exports = router;
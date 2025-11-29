/**
 * Appointment Routes
 * Routes for appointment management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  approveAppointment,
  rejectAppointment
} = require('../controllers/appointmentController');

// All authenticated users can create and view their own appointments
router.route('/')
  .post(protect, createAppointment)
  .get(protect, getAllAppointments);

router.route('/:id')
  .get(protect, getAppointmentById)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

// Admin/Security can approve/reject appointments
router.route('/:id/approve')
  .put(protect, approveAppointment);

router.route('/:id/reject')
  .put(protect, rejectAppointment);

module.exports = router;
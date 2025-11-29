/**
 * Appointment Controller
 * Handles appointment management operations
 */

const Appointment = require('../models/Appointment');
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { sendAppointmentCreated, sendAppointmentApproved, sendAppointmentCancelled } = require('../services/emailService');

/**
 * Create appointment
 * @route POST /api/appointments
 * @access Private
 */
const createAppointment = async (req, res) => {
  try {
    const { visitor, host, scheduledDate, scheduledTime, purpose, location, notes } = req.body;
    
    // Check if visitor exists
    const visitorDoc = await Visitor.findById(visitor);
    if (!visitorDoc) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISITOR_NOT_FOUND',
          message: 'Visitor not found'
        }
      });
    }
    
    // Check if host exists and is an employee
    const hostDoc = await User.findById(host);
    if (!hostDoc || hostDoc.role !== 'employee') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOST_INVALID',
          message: 'Host not found or invalid'
        }
      });
    }
    
    const appointment = await Appointment.create({
      visitor,
      host,
      scheduledDate,
      scheduledTime,
      purpose,
      location,
      notes
    });
    
    // Populate references
    await appointment.populate([
      { path: 'visitor', select: 'firstName lastName email company' },
      { path: 'host', select: 'firstName lastName email department' }
    ]);
    
    // Send notification
    try {
      await sendAppointmentCreated(appointment, visitorDoc);
    } catch (emailError) {
      console.error('Failed to send appointment creation email:', emailError);
    }
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.errors
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error creating appointment'
      }
    });
  }
};

/**
 * Get all appointments
 * @route GET /api/appointments
 * @access Private
 */
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('visitor', 'firstName lastName email company')
      .populate('host', 'firstName lastName email department')
      .populate('approvedBy', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching appointments'
      }
    });
  }
};

/**
 * Get appointment by ID
 * @route GET /api/appointments/:id
 * @access Private
 */
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('visitor', 'firstName lastName email company photo')
      .populate('host', 'firstName lastName email department')
      .populate('approvedBy', 'firstName lastName email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Get appointment by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid appointment ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching appointment'
      }
    });
  }
};

/**
 * Update appointment
 * @route PUT /api/appointments/:id
 * @access Private
 */
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('visitor', 'firstName lastName email company')
    .populate('host', 'firstName lastName email department')
    .populate('approvedBy', 'firstName lastName email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid appointment ID'
        }
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
          details: error.errors
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error updating appointment'
      }
    });
  }
};

/**
 * Delete appointment
 * @route DELETE /api/appointments/:id
 * @access Private
 */
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment not found'
        }
      });
    }
    
    // Only allow deletion if appointment is pending
    if (appointment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'APPOINTMENT_CANNOT_DELETE',
          message: 'Cannot delete appointment that is not pending'
        }
      });
    }
    
    await appointment.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid appointment ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error deleting appointment'
      }
    });
  }
};

/**
 * Approve appointment
 * @route PUT /api/appointments/:id/approve
 * @access Private (Admin/Security)
 */
const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user.id,
        approvedAt: Date.now()
      },
      {
        new: true,
        runValidators: true
      }
    )
    .populate('visitor', 'firstName lastName email company')
    .populate('host', 'firstName lastName email department')
    .populate('approvedBy', 'firstName lastName email');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment not found'
        }
      });
    }
    
    // Send approval notification
    try {
      const visitor = await Visitor.findById(appointment.visitor._id);
      await sendAppointmentApproved(appointment, visitor);
    } catch (emailError) {
      console.error('Failed to send appointment approval email:', emailError);
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Approve appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid appointment ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error approving appointment'
      }
    });
  }
};

/**
 * Reject appointment
 * @route PUT /api/appointments/:id/reject
 * @access Private (Admin/Security)
 */
const rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected'
      },
      {
        new: true,
        runValidators: true
      }
    )
    .populate('visitor', 'firstName lastName email company')
    .populate('host', 'firstName lastName email department');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPOINTMENT_NOT_FOUND',
          message: 'Appointment not found'
        }
      });
    }
    
    // Send rejection notification
    try {
      const visitor = await Visitor.findById(appointment.visitor._id);
      await sendAppointmentCancelled(appointment, visitor);
    } catch (emailError) {
      console.error('Failed to send appointment rejection email:', emailError);
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Reject appointment error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid appointment ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error rejecting appointment'
      }
    });
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  approveAppointment,
  rejectAppointment
};
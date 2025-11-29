/**
 * CheckLog Controller
 * Handles visitor check-in/check-out operations
 */

const CheckLog = require('../models/CheckLog');
const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const User = require('../models/User');
const { sendVisitorArrival } = require('../services/emailService');

/**
 * Check in visitor
 * @route POST /api/checklogs/checkin
 * @access Private (Security/Admin)
 */
const checkInVisitor = async (req, res) => {
  try {
    const { passId, location, notes } = req.body;
    
    // Find pass
    const pass = await Pass.findById(passId);
    if (!pass) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PASS_NOT_FOUND',
          message: 'Pass not found'
        }
      });
    }
    
    // Check if pass is valid
    if (!pass.isValid()) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'PASS_INVALID',
          message: 'Pass is not valid'
        }
      });
    }
    
    // Check if visitor is already checked in
    const existingCheckIn = await CheckLog.findOne({
      pass: passId,
      checkOutTime: null
    });
    
    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ALREADY_CHECKED_IN',
          message: 'Visitor is already checked in'
        }
      });
    }
    
    // Create check-in log
    const checkLog = await CheckLog.create({
      visitor: pass.visitor,
      pass: passId,
      checkInTime: Date.now(),
      checkInBy: req.user.id,
      location,
      notes
    });
    
    // Populate references
    await checkLog.populate([
      { path: 'visitor', select: 'firstName lastName email company' },
      { path: 'pass', select: 'passNumber' },
      { path: 'checkInBy', select: 'firstName lastName email' }
    ]);
    
    // Send arrival notification to host
    try {
      const visitor = await Visitor.findById(pass.visitor);
      const appointment = await pass.populate('appointment');
      if (appointment && appointment.host) {
        const host = await User.findById(appointment.host);
        if (host) {
          await sendVisitorArrival(host, visitor, checkLog.checkInTime);
        }
      }
    } catch (emailError) {
      console.error('Failed to send visitor arrival email:', emailError);
    }
    
    res.status(201).json({
      success: true,
      data: checkLog
    });
  } catch (error) {
    console.error('Check in visitor error:', error);
    
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
        message: 'Error checking in visitor'
      }
    });
  }
};

/**
 * Check out visitor
 * @route POST /api/checklogs/checkout
 * @access Private (Security/Admin)
 */
const checkOutVisitor = async (req, res) => {
  try {
    const { passId, notes } = req.body;
    
    // Find the check-in record
    const checkLog = await CheckLog.findOne({
      pass: passId,
      checkOutTime: null
    })
    .populate('visitor', 'firstName lastName email company')
    .populate('pass', 'passNumber')
    .populate('checkInBy', 'firstName lastName email');
    
    if (!checkLog) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_CHECKED_IN',
          message: 'Visitor is not checked in'
        }
      });
    }
    
    // Update check-out time
    checkLog.checkOutTime = Date.now();
    checkLog.checkOutBy = req.user.id;
    checkLog.notes = notes || checkLog.notes;
    
    await checkLog.save();
    
    // Populate checkOutBy reference
    await checkLog.populate('checkOutBy', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      data: checkLog
    });
  } catch (error) {
    console.error('Check out visitor error:', error);
    
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
        message: 'Error checking out visitor'
      }
    });
  }
};

/**
 * Get all check logs
 * @route GET /api/checklogs
 * @access Private
 */
const getAllCheckLogs = async (req, res) => {
  try {
    const checkLogs = await CheckLog.find()
      .populate('visitor', 'firstName lastName email company')
      .populate('pass', 'passNumber')
      .populate('checkInBy', 'firstName lastName email')
      .populate('checkOutBy', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: checkLogs.length,
      data: checkLogs
    });
  } catch (error) {
    console.error('Get all check logs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching check logs'
      }
    });
  }
};

/**
 * Get active visitors (checked in but not checked out)
 * @route GET /api/checklogs/active
 * @access Private
 */
const getActiveVisitors = async (req, res) => {
  try {
    const activeVisitors = await CheckLog.find({
      checkOutTime: null
    })
    .populate('visitor', 'firstName lastName email company photo')
    .populate('pass', 'passNumber validFrom validUntil')
    .populate('checkInBy', 'firstName lastName email')
    .sort({ checkInTime: -1 });
    
    res.status(200).json({
      success: true,
      count: activeVisitors.length,
      data: activeVisitors
    });
  } catch (error) {
    console.error('Get active visitors error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching active visitors'
      }
    });
  }
};

/**
 * Get check log by ID
 * @route GET /api/checklogs/:id
 * @access Private
 */
const getCheckLogById = async (req, res) => {
  try {
    const checkLog = await CheckLog.findById(req.params.id)
      .populate('visitor', 'firstName lastName email company photo')
      .populate('pass', 'passNumber validFrom validUntil')
      .populate('checkInBy', 'firstName lastName email')
      .populate('checkOutBy', 'firstName lastName email');
    
    if (!checkLog) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CHECKLOG_NOT_FOUND',
          message: 'Check log not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: checkLog
    });
  } catch (error) {
    console.error('Get check log by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid check log ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching check log'
      }
    });
  }
};

module.exports = {
  checkInVisitor,
  checkOutVisitor,
  getAllCheckLogs,
  getActiveVisitors,
  getCheckLogById
};
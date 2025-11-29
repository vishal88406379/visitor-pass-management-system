/**
 * Visitor Controller
 * Handles visitor management operations
 */

const Visitor = require('../models/Visitor');
const crypto = require('crypto');
const { generateOTP, storeOTP, verifyOTP, sendOTPEmail } = require('../services/otpService');

/**
 * Create visitor
 * @route POST /api/visitors
 * @access Private
 */
const createVisitor = async (req, res) => {
  try {
    // Handle photo upload if provided
    let photoData = null;
    if (req.body.photo) {
      // Save base64 photo data
      photoData = req.body.photo;
    }
    
    // Generate OTP for visitor verification
    const otp = crypto.randomInt(100000, 999999).toString();
    
    const visitorData = {
      ...req.body,
      createdBy: req.user.id,
      photo: photoData,
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
    };
    
    const visitor = await Visitor.create(visitorData);
    
    // Remove sensitive data from response
    const visitorResponse = visitor.toObject();
    delete visitorResponse.otp;
    delete visitorResponse.otpExpires;
    
    res.status(201).json({
      success: true,
      data: visitorResponse,
      message: 'Visitor registered successfully. OTP has been generated for verification.'
    });
  } catch (error) {
    console.error('Create visitor error:', error);
    
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
        message: 'Error creating visitor'
      }
    });
  }
};

/**
 * Get all visitors
 * @route GET /api/visitors
 * @access Private
 */
const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().populate('createdBy', 'firstName lastName email');
    res.status(200).json({
      success: true,
      count: visitors.length,
      data: visitors
    });
  } catch (error) {
    console.error('Get all visitors error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching visitors'
      }
    });
  }
};

/**
 * Get visitor by ID
 * @route GET /api/visitors/:id
 * @access Private
 */
const getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISITOR_NOT_FOUND',
          message: 'Visitor not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    console.error('Get visitor by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid visitor ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching visitor'
      }
    });
  }
};

/**
 * Update visitor
 * @route PUT /api/visitors/:id
 * @access Private
 */
const updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISITOR_NOT_FOUND',
          message: 'Visitor not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: visitor
    });
  } catch (error) {
    console.error('Update visitor error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid visitor ID'
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
        message: 'Error updating visitor'
      }
    });
  }
};

/**
 * Delete visitor
 * @route DELETE /api/visitors/:id
 * @access Private
 */
const deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'VISITOR_NOT_FOUND',
          message: 'Visitor not found'
        }
      });
    }
    
    await visitor.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete visitor error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid visitor ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error deleting visitor'
      }
    });
  }
};

/**
 * Send OTP to visitor
 * @route POST /api/visitors/send-otp
 * @access Public
 */
const sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    // Validate input
    if (!email || !phone) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and phone are required'
        }
      });
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(email, otp, 10); // 10 minutes expiry
    
    // Send OTP via email
    await sendOTPEmail(email, otp);
    
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error sending OTP'
      }
    });
  }
};

/**
 * Verify OTP for visitor
 * @route POST /api/visitors/verify-otp
 * @access Public
 */
const verifyVisitorOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Email and OTP are required'
        }
      });
    }
    
    // Verify OTP
    const isValid = verifyOTP(email, otp);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OTP',
          message: 'Invalid or expired OTP'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error verifying OTP'
      }
    });
  }
};

/**
 * Register visitor with OTP verification
 * @route POST /api/visitors/register-with-otp
 * @access Public
 */
const registerVisitorWithOTP = async (req, res) => {
  try {
    // Check if file was uploaded
    if (req.file) {
      req.body.photo = `/uploads/${req.file.filename}`;
    }
    
    // Create visitor
    const visitor = await Visitor.create(req.body);
    
    // Remove password from response if it exists
    const visitorResponse = visitor.toJSON();
    if (visitorResponse.password) {
      delete visitorResponse.password;
    }
    
    res.status(201).json({
      success: true,
      data: visitorResponse
    });
  } catch (error) {
    console.error('Register visitor with OTP error:', error);
    
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
        message: 'Error registering visitor'
      }
    });
  }
};

module.exports = {
  registerVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  sendOTP,
  verifyVisitorOTP,
  registerVisitorWithOTP
};
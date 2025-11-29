/**
 * Pass Controller
 * Handles pass management operations
 */

const Pass = require('../models/Pass');
const Visitor = require('../models/Visitor');
const Appointment = require('../models/Appointment');
const { generateQRCode } = require('../services/qrService');
const { generateBadgePDF } = require('../services/pdfService');

/**
 * Create pass
 * @route POST /api/passes
 * @access Private (Security/Admin)
 */
const createPass = async (req, res) => {
  try {
    const { visitor, appointment, validFrom, validUntil } = req.body;
    
    // Generate unique pass number
    const passNumber = `PASS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Generate QR code
    const qrData = {
      passNumber,
      visitor,
      validFrom,
      validUntil
    };
    
    const qrCodeImage = await generateQRCode(qrData);
    
    const pass = await Pass.create({
      passNumber,
      visitor,
      appointment,
      qrCode: JSON.stringify(qrData),
      qrCodeImage,
      validFrom,
      validUntil,
      issuedBy: req.user.id
    });
    
    // Populate references
    await pass.populate([
      { path: 'visitor', select: 'firstName lastName email company' },
      { path: 'appointment', select: 'scheduledDate scheduledTime purpose' },
      { path: 'issuedBy', select: 'firstName lastName email' }
    ]);
    
    res.status(201).json({
      success: true,
      data: pass
    });
  } catch (error) {
    console.error('Create pass error:', error);
    
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
        message: 'Error creating pass'
      }
    });
  }
};

/**
 * Get all passes
 * @route GET /api/passes
 * @access Private
 */
const getAllPasses = async (req, res) => {
  try {
    const passes = await Pass.find()
      .populate('visitor', 'firstName lastName email company')
      .populate('appointment', 'scheduledDate scheduledTime purpose')
      .populate('issuedBy', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      count: passes.length,
      data: passes
    });
  } catch (error) {
    console.error('Get all passes error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching passes'
      }
    });
  }
};

/**
 * Get pass by ID
 * @route GET /api/passes/:id
 * @access Private
 */
const getPassById = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate('visitor', 'firstName lastName email company photo')
      .populate('appointment', 'scheduledDate scheduledTime purpose')
      .populate('issuedBy', 'firstName lastName email');
    
    if (!pass) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PASS_NOT_FOUND',
          message: 'Pass not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: pass
    });
  } catch (error) {
    console.error('Get pass by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid pass ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching pass'
      }
    });
  }
};

/**
 * Update pass
 * @route PUT /api/passes/:id
 * @access Private (Security/Admin)
 */
const updatePass = async (req, res) => {
  try {
    const pass = await Pass.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('visitor', 'firstName lastName email company')
    .populate('appointment', 'scheduledDate scheduledTime purpose')
    .populate('issuedBy', 'firstName lastName email');
    
    if (!pass) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PASS_NOT_FOUND',
          message: 'Pass not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: pass
    });
  } catch (error) {
    console.error('Update pass error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid pass ID'
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
        message: 'Error updating pass'
      }
    });
  }
};

/**
 * Delete pass
 * @route DELETE /api/passes/:id
 * @access Private (Security/Admin)
 */
const deletePass = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id);
    
    if (!pass) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PASS_NOT_FOUND',
          message: 'Pass not found'
        }
      });
    }
    
    await pass.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete pass error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid pass ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error deleting pass'
      }
    });
  }
};

/**
 * Generate PDF badge for pass
 * @route GET /api/passes/:id/badge
 * @access Private
 */
const generatePassBadge = async (req, res) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate('visitor', 'firstName lastName email company photo')
      .populate('appointment', 'scheduledDate scheduledTime purpose');
    
    if (!pass) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PASS_NOT_FOUND',
          message: 'Pass not found'
        }
      });
    }
    
    // Generate PDF badge
    const pdfBuffer = await generateBadgePDF(pass);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=pass-${pass.passNumber}.pdf`);
    
    // Send PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate pass badge error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid pass ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error generating pass badge'
      }
    });
  }
};

module.exports = {
  createPass,
  getAllPasses,
  getPassById,
  updatePass,
  deletePass,
  generatePassBadge
};
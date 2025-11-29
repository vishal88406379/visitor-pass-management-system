/**
 * Organization Controller
 * Handles organization management operations in a multi-organization system
 */

const Organization = require('../models/Organization');
const User = require('../models/User');

/**
 * Create organization
 * @route POST /api/organizations
 * @access Private (Admin only)
 */
const createOrganization = async (req, res) => {
  try {
    // Set the requesting user as the admin
    req.body.adminUser = req.user.id;
    
    const organization = await Organization.create(req.body);
    
    res.status(201).json({
      success: true,
      data: organization
    });
  } catch (error) {
    console.error('Create organization error:', error);
    
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
        message: 'Error creating organization'
      }
    });
  }
};

/**
 * Get all organizations
 * @route GET /api/organizations
 * @access Private (Admin only)
 */
const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('adminUser', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    console.error('Get all organizations error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching organizations'
      }
    });
  }
};

/**
 * Get organization by ID
 * @route GET /api/organizations/:id
 * @access Private (Admin only)
 */
const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('adminUser', 'firstName lastName email');
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    console.error('Get organization by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid organization ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error fetching organization'
      }
    });
  }
};

/**
 * Update organization
 * @route PUT /api/organizations/:id
 * @access Private (Admin only)
 */
const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('adminUser', 'firstName lastName email');
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: organization
    });
  } catch (error) {
    console.error('Update organization error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid organization ID'
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
        message: 'Error updating organization'
      }
    });
  }
};

/**
 * Delete organization
 * @route DELETE /api/organizations/:id
 * @access Private (Admin only)
 */
const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    
    if (!organization) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ORGANIZATION_NOT_FOUND',
          message: 'Organization not found'
        }
      });
    }
    
    // Check if organization has users
    const userCount = await User.countDocuments({ organizationId: organization._id });
    
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ORGANIZATION_HAS_USERS',
          message: 'Cannot delete organization with existing users'
        }
      });
    }
    
    await organization.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete organization error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid organization ID'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Error deleting organization'
      }
    });
  }
};

module.exports = {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
};
/**
 * Authentication Middleware
 * Verifies JWT tokens and extracts user information
 */

const { verifyToken } = require('../utils/jwtUtils');
const User = require('../models/User');

/**
 * Middleware to protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Not authorized to access this route. Please login.',
        },
      });
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from database (excluding password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_INACTIVE',
            message: 'User account is inactive',
          },
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.message === 'Token has expired') {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired. Please login again.',
          },
        });
      }

      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token. Please login again.',
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error during authentication',
      },
    });
  }
};

/**
 * Middleware to authorize based on user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User not authenticated',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: `User role '${req.user.role}' is not authorized to access this route`,
        },
      });
    }

    next();
  };
};

/**
 * Check if user is admin
 */
const isAdmin = authorize('admin');

/**
 * Check if user is security personnel
 */
const isSecurity = authorize('security', 'admin');

/**
 * Check if user is employee
 */
const isEmployee = authorize('employee', 'admin');

/**
 * Check if user is admin or security
 */
const isAdminOrSecurity = authorize('admin', 'security');

module.exports = {
  protect,
  authorize,
  isAdmin,
  isSecurity,
  isEmployee,
  isAdminOrSecurity,
};

/**
 * Validation Middleware
 * Middleware for validating request data
 */

const { validateEmail, validatePhone, validateRequiredFields } = require('../utils/validation');

/**
 * Middleware to validate request body
 */
const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    const { isValid, missingFields } = validateRequiredFields(req.body, requiredFields);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Required fields are missing',
          details: { missingFields },
        },
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate email in request body
 */
const validateEmailField = (fieldName = 'email') => {
  return (req, res, next) => {
    const email = req.body[fieldName];
    
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: `Invalid email format for field '${fieldName}'`,
        },
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate phone in request body
 */
const validatePhoneField = (fieldName = 'phone') => {
  return (req, res, next) => {
    const phone = req.body[fieldName];
    
    if (phone && !validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PHONE',
          message: `Invalid phone number format for field '${fieldName}'`,
        },
      });
    }
    
    next();
  };
};

module.exports = {
  validateBody,
  validateEmailField,
  validatePhoneField,
};

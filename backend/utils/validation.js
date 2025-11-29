/**
 * Validation Utilities
 * Functions for validating user input
 */

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
const validatePhone = (phone) => {
  // Accepts formats: +1234567890, 1234567890, (123) 456-7890, 123-456-7890
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate required fields
 * @param {Object} data - Object containing fields to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} { isValid: boolean, missingFields: Array }
 */
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

/**
 * Validate file type
 * @param {string} mimetype - File mimetype
 * @param {Array} allowedTypes - Array of allowed mimetypes
 * @returns {boolean} True if valid, false otherwise
 */
const validateFileType = (mimetype, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']) => {
  return allowedTypes.includes(mimetype);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum allowed size in bytes (default 5MB)
 * @returns {boolean} True if valid, false otherwise
 */
const validateFileSize = (size, maxSize = 5 * 1024 * 1024) => {
  return size <= maxSize;
};

module.exports = {
  validateEmail,
  validatePhone,
  validateRequiredFields,
  validateFileType,
  validateFileSize,
};

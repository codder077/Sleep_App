const { body, validationResult } = require('express-validator');

// Enhanced validation result handler with better error formatting
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Group errors by field for better organization
    const errorMap = {};
    const errorList = [];
    
    errors.array().forEach(error => {
      const field = error.path;
      if (!errorMap[field]) {
        errorMap[field] = [];
      }
      errorMap[field].push(error.msg);
      errorList.push({
        field: error.path,
        message: error.msg,
        value: error.value
      });
    });

    // Create user-friendly error messages
    const fieldMessages = Object.keys(errorMap).map(field => {
      const messages = errorMap[field];
      return `${field}: ${messages.join(', ')}`;
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check the following fields:',
      errors: errorList,
      fieldMessages: fieldMessages,
      summary: `Please fix ${Object.keys(errorMap).length} field(s) with errors.`
    });
  }
  next();
};

// Enhanced password validation with specific requirements
const validatePassword = (fieldName = 'password') => {
  return body(fieldName)
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])/)
    .withMessage('Password must contain at least one lowercase letter (a-z)')
    .matches(/^(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter (A-Z)')
    .matches(/^(?=.*\d)/)
    .withMessage('Password must contain at least one number (0-9)')
    .matches(/^(?=.*[@$!%*?&])/)
    .withMessage('Password must contain at least one special character (@$!%*?&)')
    .matches(/^[a-zA-Z0-9@$!%*?&]{8,}$/)
    .withMessage('Password can only contain letters, numbers, and special characters (@$!%*?&)');
};

// User registration validation with enhanced error messages
const validateRegistration = [
  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('Display name is required')
    .isLength({ min: 2, max: 32 })
    .withMessage('Display name must be between 2 and 32 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Display name can only contain letters, numbers, and spaces'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address (e.g., user@example.com)'),
  
  validatePassword('password'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Enhanced sleep data validation
const validateSleepData = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 1, max: 32 })
    .withMessage('Username must be between 1 and 32 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('change')
    .optional()
    .isArray({ max: 10 })
    .withMessage('You can select up to 10 sleep goals'),
  
  body('change.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each sleep goal must be between 1 and 100 characters'),
  
  body('sleepStruggle.min')
    .isIn([0, 2, 8])
    .withMessage('Sleep struggle minimum must be 0, 2, or 8 hours'),
  
  body('sleepStruggle.max')
    .isIn([2, 8, 10])
    .withMessage('Sleep struggle maximum must be 2, 8, or 10 hours')
    .custom((value, { req }) => {
      if (value <= req.body.sleepStruggle.min) {
        throw new Error('Maximum sleep struggle must be greater than minimum');
      }
      return true;
    }),
  
  body('bedTime')
    .notEmpty()
    .withMessage('Bed time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Bed time must be in HH:MM format (e.g., 22:30)'),
  
  body('wakeTime')
    .notEmpty()
    .withMessage('Wake time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Wake time must be in HH:MM format (e.g., 07:00)'),
  
  body('sleepDuration')
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep duration must be between 0 and 24 hours'),
  
  body('sleepQuality')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Sleep quality must be between 1 and 10'),
  
  body('sleepEfficiency')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Sleep efficiency must be between 0 and 100 percent'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  body('tags')
    .optional()
    .isArray({ max: 5 })
    .withMessage('You can add up to 5 tags'),
  
  body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Each tag must be between 1 and 20 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/)
    .withMessage('Tags can only contain letters, numbers, spaces, and hyphens'),
  
  handleValidationErrors
];

// Enhanced user profile update validation
const validateProfileUpdate = [
  body('displayName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 32 })
    .withMessage('Display name must be between 2 and 32 characters')
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Display name can only contain letters, numbers, and spaces'),
  
  body('phoneCode')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{1,4}$/)
    .withMessage('Phone code must be 1-4 digits with optional + prefix (e.g., +1, +44)'),
  
  body('phoneNumber')
    .optional()
    .trim()
    .matches(/^[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Phone number must be 7-15 digits and can include spaces, hyphens, and parentheses'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('City name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('City name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('state')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('State name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('State name can only contain letters, spaces, hyphens, and apostrophes'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Country name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Country name can only contain letters, spaces, hyphens, and apostrophes'),
  
  handleValidationErrors
];

// Enhanced password update validation
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  validatePassword('newPassword'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match the new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Additional validation helpers
const validateEmail = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

const validateObjectId = [
  body('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateSleepData,
  validateProfileUpdate,
  validatePasswordUpdate,
  validateEmail,
  validateObjectId,
  handleValidationErrors,
  validatePassword
}; 
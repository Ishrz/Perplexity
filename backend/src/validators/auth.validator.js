import { body, validationResult } from 'express-validator';

// Validation middleware to check for errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

// Register validation
export const validateRegister = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .trim()
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .isLength({ max: 10 }).withMessage('Username must not exceed 10 characters')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain uppercase, lowercase, number, and special character'),
  
  handleValidationErrors
];

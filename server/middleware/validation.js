const { body, validationResult } = require('express-validator');

// Validation rules for creating/updating a post
const validatePost = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

// Validation rules for creating a category
const validateCategory = [
  body('name').notEmpty().withMessage('Name is required'),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validatePost,
  validateCategory,
  handleValidationErrors,
};

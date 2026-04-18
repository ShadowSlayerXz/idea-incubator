const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const ideaValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'])
    .withMessage('Invalid category'),
  handleValidationErrors,
];

module.exports = { ideaValidator };

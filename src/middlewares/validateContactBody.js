import { body, validationResult } from 'express-validator';

export const validateContactBody = [
  body('name')
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 20 })
    .withMessage('Name must be between 3 and 20 characters'),
  body('phoneNumber')
    .isString()
    .withMessage('Phone number must be a string')
    .isLength({ min: 3, max: 20 })
    .withMessage('Phone number must be between 3 and 20 characters'),
  body('contactType')
    .isIn(['work', 'personal', 'home'])
    .withMessage('Contact type must be one of: work, personal, home'),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

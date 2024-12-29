import Joi from 'joi';

export const validateJoi = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation failed',
        errors: error.details,
      });
    }
    next();
  };
};

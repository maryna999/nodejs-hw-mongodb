import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message).join(', ');
      return next(createError(400, `Validation error: ${errors}`));
    }
    next();
  };
};

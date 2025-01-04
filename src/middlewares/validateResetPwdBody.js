import { resetPwdSchema } from '../validation/auth.js';

export const validateResetPwdBody = (req, res, next) => {
  const { error } = resetPwdSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      errors: error.details.map((err) => ({
        message: err.message,
        path: err.path,
      })),
    });
  }

  next();
};

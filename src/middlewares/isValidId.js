import mongoose from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(createError(400, 'Invalid ID format'));
  }

  next();
};

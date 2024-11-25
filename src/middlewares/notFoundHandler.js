import createError from 'http-errors';

export const notFoundHandler = (req, res, next) => {
  const error = createError(404, 'Route not found');
  res.status(404).json({
    status: 404,
    message: error.message,
  });
};

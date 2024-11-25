// src/middlewares/errorHandler.js

import createError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Якщо помилка не має статусу, ставимо 500
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  const data = err.data || null;

  // Відправка відповіді з помилкою
  res.status(status).json({
    status,
    message,
    data,
  });
};

// src/utils/ctrlWrapper.js

export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (err) {
      next(err); // Якщо помилка, передаємо її в errorHandler
    }
  };
};

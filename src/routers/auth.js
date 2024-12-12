import express from 'express';
import { registerUser } from '../services/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/auth.js';
import { login, refreshSession } from '../controllers/auth.js';
import { validateCookies } from '../middlewares/validateCookies.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const newUser = await registerUser({ name, email, password });

      res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/login',
  validateBody({
    email: { isEmail: true, errorMessage: 'Invalid email format' },
    password: { notEmpty: true, errorMessage: 'Password is required' },
  }),
  login,
);

router.post('/refresh', validateCookies, refreshSession);

export default router;

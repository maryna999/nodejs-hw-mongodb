import express from 'express';
import { registerUser } from '../services/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  resetPwdSchema,
} from '../validation/auth.js';
import {
  login,
  refreshSession,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { validateRefreshToken } from '../middlewares/validateRefreshToken.js';

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
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', validateRefreshToken, logout);
router.post('/refresh', validateRefreshToken, refreshSession);
router.post('/send-reset-email', sendResetEmail);
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);

export default router;

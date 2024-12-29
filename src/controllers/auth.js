import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../utils/env.js';
import {
  registerUser,
  authenticateUser,
  generateTokens,
} from '../services/auth.js';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';
import { sendEmail } from '../utils/emailService.js';

export const register = async (req, res, next) => {
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
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (!user) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createHttpError(401, 'Invalid email or password');
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const newSession = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newSession.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is missing');
    }

    const deletedSession = await Session.findOneAndDelete({ refreshToken });

    if (!deletedSession) {
      throw createHttpError(404, 'Session not found');
    }

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const sessionId = req.session._id;

    if (!sessionId) {
      throw createHttpError(400, 'Session ID is missing');
    }

    const session = await Session.findById(sessionId);

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }

    if (new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Refresh token is expired');
    }

    const newAccessToken = generateTokens({ _id: session.userId }).accessToken;

    session.accessToken = newAccessToken;
    session.accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    await session.save();

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const sendResetEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(createHttpError(400, 'Email is required'));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    const token = jwt.sign({ email: user.email }, env('JWT_SECRET'), {
      expiresIn: '5m',
    });

    const resetUrl = `${env('APP_DOMAIN')}/reset-password?token=${token}`;

    const htmlContent = `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`;

    try {
      await sendEmail(email, 'Password Reset', htmlContent);
    } catch {
      return next(createHttpError(500, 'Error sending reset password email.'));
    }

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return next(createHttpError(400, 'Token is required'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env('JWT_SECRET'));
    } catch {
      return next(createHttpError(401, 'Token is expired or invalid.'));
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return next(createHttpError(404, 'User not found!'));
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

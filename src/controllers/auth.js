import createHttpError from 'http-errors';
import {
  registerUser,
  authenticateUser,
  generateTokens,
  logoutSessionService,
} from '../services/auth.js';
import { Session } from '../db/models/session.js';

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

export const refreshSession = async (req, res, next) => {
  try {
    console.log('Session in req:', req.session);

    const sessionId = req.session._id;

    if (!sessionId) {
      throw createHttpError(400, 'Session ID is missing');
    }

    const deletedSession = await Session.findByIdAndDelete(sessionId);
    console.log('Deleted session:', deletedSession);

    if (!deletedSession) {
      throw createHttpError(404, 'Session not found');
    }

    const newTokens = generateTokens({ _id: req.session.userId });
    console.log('Generated tokens:', newTokens);

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.json({ accessToken: newTokens.accessToken });
  } catch (error) {
    console.error('Error in refreshSession:', error);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is missing');
    }

    const session = await Session.findOne({ refreshToken });

    if (!session) {
      throw createHttpError(404, 'Session not found');
    }

    await logoutSessionService(refreshToken);
    await Session.findByIdAndDelete(session._id);

    res.clearCookie('refreshToken');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

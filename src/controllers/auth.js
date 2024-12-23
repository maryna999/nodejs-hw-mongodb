import createHttpError from 'http-errors';
import {
  registerUser,
  authenticateUser,
  generateTokens,
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

import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';

export const validateRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw createHttpError(400, 'Refresh token is missing');
    }

    const session = await Session.findOne({ refreshToken });

    if (!session || new Date() > session.refreshTokenValidUntil) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

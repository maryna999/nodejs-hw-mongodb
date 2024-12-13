import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';

export const validateCookies = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);

    if (!refreshToken) {
      throw createHttpError(401, 'Refresh token is missing');
    }

    const session = await Session.findOne({
      refreshToken: req.cookies.refreshToken.toString(),
    });

    console.log('Session found:', session);

    if (!session || session.refreshTokenValidUntil > Date.now()) {
      throw createHttpError(401, 'Invalid or expired refresh token');
    }

    req.session = session;
    next();
  } catch (error) {
    next(error);
  }
};

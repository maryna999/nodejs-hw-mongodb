// /middlewares/authenticate.js
import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js'; // correct import
import { User } from '../db/models/user.js'; // correct import

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.sessionToken; // Очікується токен у cookies

    if (!token) {
      throw createHttpError(401, 'Authorization token missing');
    }

    const session = await Session.findOne({ token });
    if (!session) {
      throw createHttpError(401, 'Access token not found or invalid');
    }

    const user = await User.findById(session.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, 'Access token expired'));
  }
};

export default authenticate;

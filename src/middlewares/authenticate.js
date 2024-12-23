import createHttpError from 'http-errors';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw createHttpError(401, 'The authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw createHttpError(401, 'Auth header should be of type Bearer');
    }

    // Знаходимо сесію за токеном доступу
    const session = await Session.findOne({ accessToken: token });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    // Логування значень
    console.log('Access Token Valid Until:', session.accessTokenValidUntil);
    console.log('Current Time:', new Date());

    // Перевіряємо чи не прострочений токен
    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      console.log('Token is expired');
      throw createHttpError(401, 'Access token expired');
    }

    // Знаходимо користувача за id з сесії
    const user = await User.findById(session.userId);

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Зберігаємо дані користувача в запиті для подальшого використання
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;

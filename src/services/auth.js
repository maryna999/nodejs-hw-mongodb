import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import createHttpError from 'http-errors';

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return newUser.toObject({
    versionKey: false,
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  });
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return user;
};

export const generateTokens = (user) => {
  const accessToken = `${user._id}_${Date.now() + 15 * 60 * 1000}`;
  const refreshToken = `${user._id}_${Date.now() + 30 * 24 * 60 * 60 * 1000}`;

  return { accessToken, refreshToken };
};

export const refreshSessionService = async (userId) => {
  await Session.deleteMany({ userId });

  const { accessToken, refreshToken } = generateTokens({ _id: userId });

  const newSession = new Session({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });

  await newSession.save();

  return { accessToken, refreshToken };
};

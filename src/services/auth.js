import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  await newUser.save();

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createError(401, 'Invalid email or password');
  }

  await Session.deleteOne({ userId: user._id });

  const accessTokenSecret =
    '45f10e4c8e7a64e7a87f36a8b96c6e7f1c8f7497d84f01d3efc8f48e8f3e1c7e';
  const refreshTokenSecret =
    'e7b84f8f93a74e7f16c7495e8f81d3e7a8b8f4f48f6e93a84f1c4b8e5f3e1d7f';

  const accessToken = jwt.sign({ id: user._id }, accessTokenSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: user._id }, refreshTokenSecret, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const renewSession = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('Payload decoded:', payload);
  } catch (err) {
    console.error('Token verification failed:', err);
    throw createError(401, 'Invalid or expired refresh token');
  }

  const userId = payload.id;
  console.log('User ID from payload:', userId);

  const existingSession = await Session.findOne({ userId, refreshToken });
  if (!existingSession) {
    throw createError(401, 'Session not found or refresh token invalid');
  }
  await Session.deleteOne({ userId });

  const newAccessToken = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' },
  );

  const newRefreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' },
  );

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, newRefreshToken };
};

export const deleteSession = async (refreshToken) => {
  const session = await Session.findOneAndDelete({ refreshToken });

  if (!session) {
    throw createError(404, 'Session not found');
  }
};

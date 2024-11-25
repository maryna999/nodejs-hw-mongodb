// src/db/initMongoConnection.js

import mongoose from 'mongoose';
import { env } from '../utils/env.js';

export const initMongoConnection = async () => {
  try {
    const user = env('MONGODB_USER');
    const password = encodeURIComponent(env('MONGODB_PASSWORD'));
    const host = env('MONGODB_URL');
    const database = env('MONGODB_DB');

    const dbURI = `mongodb+srv://${user}:${password}@${host}/${database}?retryWrites=true&w=majority`;

    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbURI);

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error while setting up mongo connection:', error.message);
    throw error;
  }
};

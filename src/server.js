// src/server.js

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

export const setupServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Підключення до MongoDB
  await initMongoConnection();

  // Налаштовуємо middlewares
  app.use(express.json());
  app.use(cors());
  app.use(pino({ transport: { target: 'pino-pretty' } }));

  // Головний маршрут
  app.get('/', (req, res) => {
    res.json({ message: 'Hello Mentor!' });
  });

  // Використовуємо маршрути для контактів
  app.use('/contacts', contactsRouter);

  // Обробка невідомих маршрутів
  app.use('*', notFoundHandler);

  // Глобальна обробка помилок
  app.use(errorHandler);

  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

export const setupServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  await initMongoConnection();

  app.use(express.json());
  app.use(cors());
  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cookieParser());

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const swaggerDocument = YAML.load(`${__dirname}/../docs/openapi.yaml`);
  console.log(swaggerDocument); // Перевірте, чи виводиться правильний об'єкт

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/auth', authRouter);

  app.get('/', (req, res) => {
    res.json({ message: 'Hello Mentor!' });
  });

  app.use('/contacts', contactsRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

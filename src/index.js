import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const bootServer = async () => {
  await initMongoConnection();
  setupServer();
};

bootServer();

// src/index.js

import { setupServer } from './server.js';

const bootServer = async () => {
  await setupServer();
};

bootServer();

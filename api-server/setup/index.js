import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import apiRoutes from '../api';
import httpLogger from './http-logger';
import mongoConnection from './mongo-connection';
import fixtures from './fixtures';

export default async function serverSetup(config) {
  const {
    FIXTURES_ENABLED,
    MONGO_DB_CON_STRING,
    DB_BASE_NAME,
    JWT_SECRET,
  } = config;

  let mongoose;
  try {
    mongoose = await mongoConnection(MONGO_DB_CON_STRING, DB_BASE_NAME);
  } catch (err) {
    console.log('Error opening mongo connection\n', err);
    process.exit(1);
  }

  /**
   * Important! Fixtures MUST NOT run in production in any circumstances
   */
  if (process.env.NODE_ENV !== 'production' && FIXTURES_ENABLED === true) {
    try {
      await fixtures(mongoose);
    } catch (err) {
      console.log('Error running fixtures', err);
    }
  }

  const app = express();

  app.use(cors());

  app.set('JWT_SECRET', JWT_SECRET);

  app.use(bodyParser.json());

  httpLogger(app);

  apiRoutes(app, mongoose);

  if (process.env.NODE_ENV === 'test' && !process.env.TEST_LOGGERS_ENABLED) {
    return Promise.resolve(app);
  }

  console.log('[Timezone Manager] setup done');

  return Promise.resolve(app);
}

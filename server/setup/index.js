import express from 'express';
import bodyParser from 'body-parser';

import apiRoutes from '../api';
import httpLogger from './http-logger';
import mongoConnection from './mongo-connection';
import fixtures from './fixtures';

export default async function serverSetup(config) {
  const {
    FIXTURES_ENABLED,
    MONGO_DB_CON_STRING, DB_PROD_NAME_DEV, DB_PROD_NAME_PROD,
    JWT_SECRET,
  } = config;

  let mongoose;
  const databaseName = process.env.NODE_ENV === 'production' ? DB_PROD_NAME_PROD : DB_PROD_NAME_DEV;
  try {
    mongoose = await mongoConnection(MONGO_DB_CON_STRING, databaseName);
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

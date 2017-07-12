import mongoConnection from '../server/setup/mongo-connection';
import fixtures from '../server/setup/fixtures';

import { DB_PROD_NAME_PROD, DB_PROD_NAME_DEV, MONGO_DB_CON_STRING } from '../server/config';

const databaseName = process.env.NODE_ENV === 'production' ? DB_PROD_NAME_PROD : DB_PROD_NAME_DEV;
mongoConnection(MONGO_DB_CON_STRING, databaseName)
.then(async (mongoose) => {
  await fixtures(mongoose);
  process.exit(0);
});
import config from 'config';

import mongoConnection from '../api-server/setup/mongo-connection';
import fixtures from '../api-server/setup/fixtures';


const { DB_BASE_NAME, MONGO_DB_CON_STRING } = config;

mongoConnection(MONGO_DB_CON_STRING, DB_BASE_NAME)
.then(async (mongoose) => {
  await fixtures(mongoose);
  process.exit(0);
});

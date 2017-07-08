const JWT_SECRET = 'tsuminomai1561';
export { JWT_SECRET };

const MONGO_DB_CON_STRING = process.env.MONGO_HOST || '127.0.0.1:27017';
export { MONGO_DB_CON_STRING };

/**
 * Databse names for prod and dev. Declared here for adding the ability
 * to change DB names via different config files without touching
 * application code.
 */
const DB_BASE_NAME = 'timezone-manager';

const DB_PROD_NAME_PROD = `${DB_BASE_NAME}-prod`;
const DB_PROD_NAME_DEV = `${DB_BASE_NAME}-dev`;

export { DB_PROD_NAME_PROD, DB_PROD_NAME_DEV };

const APP_PORT = parseInt(process.env.APP_PORT, 10) || 3185;
const APP_HOST = process.env.APP_HOST || 'localhost';

export { APP_PORT, APP_HOST };


const FIXTURES_ENABLED = true;
export { FIXTURES_ENABLED };

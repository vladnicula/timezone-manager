const APP_PORT = parseInt(process.env.APP_PORT, 10) || 9150;
const APP_HOST = process.env.APP_HOST || 'qa.timezones.com';

const API_PROTOCOL = process.env.BROWSER ? '' : 'http:';

module.exports = {
  JWT_SECRET: 'tsuminomai1561',
  MONGO_DB_CON_STRING: process.env.MONGO_HOST || '127.0.0.1:27017',
  DB_BASE_NAME: 'timezone-manager-test',
  APP_PORT,
  APP_HOST,
  FIXTURES_ENABLED: true,

  client: {
    API_ENDPOINT: `${API_PROTOCOL}//${APP_HOST}:${APP_PORT}`,
  },
};

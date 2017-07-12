import users from './users';
import timezones from './timezones';
import error from './error';

export default function (app, mongoose) {
  app.use('/api/v1/', timezones(mongoose));
  app.use('/api/v1/', users(mongoose));
  app.use(error);
}

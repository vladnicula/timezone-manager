/**
 * For DEV ONLY! Make sure this does not get used in production.
 * Sets up a development environment with basic data.
 */
import UsersData from './Users';
import User from '../../models/user';

/**
 * Drops a collection from mongo if it exists in the current
 * connection described by mongoose.
 */
const dropMongoCollection = (mongoose, name) => {
  const targetCollection = mongoose.connection.collections[name.toLowerCase()];
  if (!targetCollection) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    targetCollection.drop((err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

export default async function (mongoose) {
  console.log('fixtures');
  try {
    await dropMongoCollection(mongoose, 'Users');
    await dropMongoCollection(mongoose, 'Timezones');
  } catch (err) {
    console.log('Error droping collections in fixtures', err);
    return;
  }

  try {
    await User.create(UsersData);
  } catch (err) {
    console.log('Error running inserts in fictures', err);
  }
}

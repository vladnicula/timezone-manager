import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

export default function (connectionString, dbName) {
  console.log('[Timezone Manager]: mongo server startup');
  return new Promise((resolve, reject) => {
    mongoose.connect(`mongodb://${connectionString}/${dbName}`, {
      useMongoClient: true,
    });

    const db = mongoose.connection;

    db.once('error', reject);
    db.once('open', () => resolve(mongoose));
  });
}

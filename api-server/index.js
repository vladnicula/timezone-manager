import setup from './setup';

import * as config from './config';

setup(config).then((app) => {
  app.listen(config.APP_PORT, config.APP_HOST, () => {
    if (process.env.NODE_ENV === 'test' && !process.env.TEST_LOGGERS_ENABLED) {
      return false;
    }
    console.log(`[Timezone Manager]: startup complete. Listening on  ${config.APP_HOST}:${config.APP_PORT}!`);
    return true;
  });
});

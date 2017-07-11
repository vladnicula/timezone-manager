import morgan from 'morgan';

export default function (app) {
  if (process.env.NODE_ENV === 'test') {
    if (process.env.TEST_LOGGERS_ENABLED) {
      app.use(morgan('tiny'));
    }
  } else {
    app.use(morgan('combined'));
  }
}

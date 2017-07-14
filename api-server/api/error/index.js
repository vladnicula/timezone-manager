const getStringMessage = (err) => {
  if (typeof err === 'string') {
    return err;
  }

  if (typeof err === 'object') {
    if (err.stack && process.env.NODE_ENV === 'development') {
      return err.stack;
    }

    return err.toString();
  }

  return null;
};

export default function (err, req, res, next) {
  // if (process.env.NODE_ENV === 'development') {
  // console.log(err);
  // }
  if (err.name === 'ValidationError') {
    return res.status(403).json({
      status: 'error',
      message: 'Validation Error',
      errors: err.errors,
    });
  }

  // let express handle errors in development
  if (process.env.NODE_ENV === 'development') {
    return next(err);
  }

  return res.status(500).json({
    status: 'error',
    message: getStringMessage(err),
  });
}

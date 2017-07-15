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
    if (err.errors) {
      return res.status(400).json({
        status: 'error',
        message: err.errors[Object.keys(err.errors)[0]].message,
        errors: err.errors,
      });
    }
    return res.status(400).json({
      status: 'error',
      message: 'Validation Error',
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

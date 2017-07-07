const getStringMessage = err => {
  if (typeof err === 'string') {
    return err
  }

  if (typeof err === 'object') {
    if (err.stack && process.env.NODE_ENV === 'development') {
      return err.stack
    }

    return err.toString()
  }
}

export default function(err, req, res, next) {
  // let express handle errors in development
  if (process.env.NODE_ENV === 'development') {
    return next(err)
  }

  res.status(500).json({
    status: 'error',
    message: getStringMessage(err)
  })
  console.error(err)
}

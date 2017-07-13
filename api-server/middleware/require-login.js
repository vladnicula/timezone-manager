import jwt from 'jsonwebtoken';

export default function requireLogin(req, res, next) {
  const authToken = req.headers['x-access-token'];

  if (authToken) {
    jwt.verify(authToken, req.app.get('JWT_SECRET'), (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Failed to authenticate token.' });
      }
      req.decoded = decoded;
      return next();
    });
  } else {
    return res.status(403).send({
      status: 'error',
      message: 'Authentication token required and not provided.',
    });
  }

  return true;
}

export function prepareLogin(req, res, next) {
  const authToken = req.headers['x-access-token'];

  if (authToken) {
    jwt.verify(authToken, req.app.get('JWT_SECRET'), (err, decoded) => {
      if (err) {
        return next();
      }
      req.decoded = decoded;
      return next();
    });
  } else {
    return next();
  }
}

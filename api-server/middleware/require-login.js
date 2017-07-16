import jwt from 'jsonwebtoken';
import User from '../models/user';

export default function requireLogin(req, res, next) {
  const authToken = req.headers['x-access-token'];
  req.decoded = {};
  if (authToken) {
    jwt.verify(authToken, req.app.get('JWT_SECRET'), (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ status: 'error', message: 'Failed to authenticate token.' });
      }

      User.findById(decoded._id, (error, user) => {
        if (error) {
          return next(error);
        }

        if (!user) {
          return next();
        }

        const jsonUser = user.toJSON();
        req.decoded = {
          ...jsonUser,
          _id: jsonUser._id.toString(),
        };
        return next();
      });

      return true;
    });
  } else {
    return res.status(400).send({
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
    next();
  }
}

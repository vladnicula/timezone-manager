import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user';

export default {
  listAll: async (req, res) => {
    const users = await User.find({});
    res.json({
      users,
      status: 'ok',
    });
  },

  register: async (req, res) => {
    const { username, password } = req.body;

    if (!password || password.length < 4) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or empty password',
      });
    }

    if (!username || username.length < 4) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid or empty username',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      username,
      password: passwordHash,
    });

    return res.json({
      status: 'ok',
    });
  },

  update: async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    if (bcrypt.compareSync(password, passwordHash)) {
      await User.findOneAndUpdate(
        { username },
        {
          username,
          password: passwordHash,
        },
      );

      res.json({
        user: {
          username,
        },
        status: 'ok',
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'user authorisation failed',
      });
    }
  },


  authenticate: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(403).json({
        status: 'error',
        message: 'empty user credentials',
      });
    }

    const matchedUser = await User.findOne({
      username,
    });

    if (!matchedUser) {
      return res.status(401).json({
        status: 'error',
        message: 'invalid user credentials',
      });
    }

    if (!bcrypt.compareSync(password, matchedUser.password)) {
      return res.status(401).json({
        status: 'error',
        message: 'invalid user password',
      });
    }

    const authToken = jwt.sign(
        matchedUser.toJSON(),
        req.app.get('JWT_SECRET'),
      {
        expiresIn: 24 * 60 * 60, // 24 hours token lifespan
      },
      );

    return res.json({
      status: 'ok',
      token: authToken,
    });
  },
}
;

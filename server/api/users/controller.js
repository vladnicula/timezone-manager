import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user';

export default {
  listAll: async (req, res) => {
    const users = await User.find({}).select('username _id, role').exec();
    res.json({
      users,
      status: 'ok',
    });
  },

  removeUser: async (req, res) => {
    const { id } = req.params;
    const target = await User.findByIdAndRemove(id);
    if (target) {
      return res.json({
        user: target,
        status: 'ok',
      });
    }

    return res.status(403).json({
      status: 'error',
      message: 'user not found',
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

    const resopnse = await User.create({
      username,
      password: passwordHash,
    });

    return res.json({
      status: 'ok',
      user: {
        username: resopnse.username,
        id: resopnse._id,
        role: resopnse.role,
      },
    });
  },

  userDetails: async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('username _id, role').exec();
    res.json({
      users: [user],
      status: 'ok',
    });
  },

  update: async (req, res) => {
    const { username, password, role } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    if (bcrypt.compareSync(password, passwordHash)) {
      await User.findOneAndUpdate(
        { username },
        {
          username,
          password: passwordHash,
          role,
        },
      );

      res.json({
        user: {
          username,
          role,
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

    const userData = matchedUser.toJSON();

    const authToken = jwt.sign(
        userData,
        req.app.get('JWT_SECRET'),
      {
        expiresIn: 24 * 60 * 60, // 24 hours token lifespan
      },
      );

    return res.json({
      status: 'ok',
      token: authToken,
      user: {
        id: userData._id,
        username: userData.username,
      },
    });
  },
}
;

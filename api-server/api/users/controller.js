import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../../models/user';


export default {
  listAll: async (req, res) => {
    const decoded = req.decoded;
    if (!decoded.role) {
      return res.status(403).json({
        status: 'error',
        message: 'Action not allowed with curreny user role',
      });
    }
    const users = await User.find({}).select('username _id, role').exec();
    return res.json({
      users,
      status: 'ok',
    });
  },

  removeUser: async (req, res) => {
    const { id } = req.params;
    const { _id: authId } = req.decoded;
    const currentUser = await User.findById(authId);
    const target = await User.findByIdAndRemove(id);

    if (!currentUser.role || target.role > currentUser.role) {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot delete this user',
      });
    }

    if (target) {
      await target.remove();
      return res.json({
        status: 'ok',
      });
    }

    return res.status(403).json({
      status: 'error',
      message: 'User not found',
    });
  },

  register: async (req, res) => {
    const { username, password } = req.body;

    const resopnse = await User.create({
      username,
      password,
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
    let { id } = req.params;
    if (id === 'me') {
      id = req.decoded._id;
    }

    const user = await User.findById(id).select('username _id, role').exec();
    res.json({
      users: [user],
      status: 'ok',
    });
  },

  update: async (req, res) => {
    const id = req.params.id || req.body.id;
    const { role, username, password, newPassword } = req.body;
    const { _id: authId, role: authRole } = req.decoded;

    const targetUser = await User.findById(id);

    /**
     * Only admins edit admins
     */
    if (targetUser.role === 2 && authRole < 2) {
      return res.status(403).json({
        status: 'error',
        message: 'Authorisation failed. Only admins can edit admins',
      });
    }

    if (
      (role !== undefined && !authRole)
      || (role === 2 && authRole !== 2)
    ) {
      return res.status(403).json({
        status: 'error',
        message: 'Authorisation failed. Role operation denyed.',
      });
    }

    /**
     * If simple user
     */
    if (!authRole) {
      if (id && authId !== id) {
        return res.status(403).json({
          status: 'error',
          message: 'Authorisation failed. Users can only change their own details',
        });
      }

      if (!password || !bcrypt.compareSync(password, targetUser.password)) {
        return res.status(403).json({
          status: 'error',
          message: 'Authorisation failed. User password incorrect',
        });
      }
    }

    if (role !== undefined) {
      targetUser.role = role;
    }

    if (username) {
      targetUser.username = username;
    }

    if (password) {
      targetUser.password = password;
    }

    if (newPassword) {
      targetUser.password = newPassword;
    }

    const result = await targetUser.save();
    return res.json({
      users: [result],
      status: 'ok',
    });
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
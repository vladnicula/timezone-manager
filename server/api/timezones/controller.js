import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Timezone from '../../models/timezone';
import User from '../../models/user';

export default {
  listAll: async (req, res) => {
    const decoded = req.decoded;
    return res.json({
      status: 'ok',
    });
  },

  create: async (req, res) => {
    const decoded = req.decoded;
    const { name, city, offset } = req.body;
    const targetUserId = req.body.userId || decoded._id;
    const currentAccount = await User.findById(decoded._id);

    if (targetUserId !== decoded._id) {
      if (currentAccount.role !== 2) {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot add timezone to target account.',
        });
      }

      const targetAccount = await User.findById(targetUserId);
      if (currentAccount.role < targetAccount.role) {
        return res.status(403).json({
          status: 'error',
          message: 'Cannot add timezone to target account.',
        });
      }
    }

    const timezone = await Timezone.create({
      name, city, offset, userId: targetUserId,
    });

    return res.json({
      status: 'ok',
      timezones: [timezone],
    });
  },
};

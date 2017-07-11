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
      name, city, offset: parseFloat(offset), userId: targetUserId,
    });

    return res.json({
      status: 'ok',
      timezones: [timezone],
    });
  },

  update: async (req, res) => {
    const id = req.params.id || req.body.userId;
    const { name, city, offset, userId } = req.body;
    const { _id: authId, role: authRole } = req.decoded;

    const timezone = await Timezone.findById(id);
    const currentUserIdForTimezone = timezone.userId.toString();

    if (userId && currentUserIdForTimezone !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Changing user id of timezone not allowed.',
      });
    }

    if (authId !== timezone.userId.toString() && authRole !== 2) {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot update timezone of another user.',
      });
    }

    if (name) {
      timezone.name = name;
    }

    if (city) {
      timezone.city = city;
    }

    if (offset) {
      timezone.offset = parseFloat(offset);
    }

    await timezone.save();

    return res.json({
      status: 'ok',
      timezones: [timezone],
    });
  },
};

import Timezone from '../../models/timezone';
import User from '../../models/user';

export default {
  listAll: async (req, res) => {
    const decoded = req.decoded;
    const { user_id: userId, before, limit, filter_name: filterName } = req.query;
    const { role: authRole, _id: authId } = decoded;

    if ((userId !== undefined && userId !== authId) && authRole !== 2) {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot access timezone list of target account.',
      });
    }

    const query = {
      userId: (userId || authId).toString(),
    };

    if (before) {
      query.createdTimestamp = { $lte: before };
    }

    if (filterName) {
      if (!filterName.match(/^[A-Za-z0-9\-_ ]{1,}$/)) {
        return res.json({
          status: 'ok',
          timezones: [],
        });
      }
      // query.$text = { $search: `"${filterName}"` };
      query.name = {
        $regex: `.*${filterName}.*`,
        $options: 'i',
      };
    }

    let timezonesOp = Timezone.find(query);

    if (limit) {
      timezonesOp = timezonesOp.limit(limit);
    }

    const timezones = await timezonesOp.exec();

    return res.json({
      status: 'ok',
      timezones,
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

    if (authId !== currentUserIdForTimezone && authRole !== 2) {
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

  delete: async (req, res) => {
    const { id } = req.params;
    const { _id: authId, role: authRole } = req.decoded;

    const timezone = await Timezone.findById(id);
    const currentUserIdForTimezone = timezone.userId.toString();

    if (authId !== currentUserIdForTimezone && authRole !== 2) {
      return res.status(403).json({
        status: 'error',
        message: 'Cannot delete timezone of another user.',
      });
    }

    await timezone.remove();

    return res.json({
      status: 'ok',
    });
  },
};

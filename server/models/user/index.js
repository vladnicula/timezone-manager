import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: Number,
    defalut: 0,
    // 2- 'admin', 1 - 'manager', 0 - 'simple'
    enum: [0, 1, 2],
  },
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

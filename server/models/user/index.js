import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },

  password: {
    type: String,
    required: true,
    minlength: 4,
  },

  role: {
    type: Number,
    defalut: 0,
    // 2- 'admin', 1 - 'manager', 0 - 'simple'
    enum: [0, 1, 2],
  },
});


/**
 * Because we rely on async operations to verify
 * whether a document exists in the database, it's
 * possible for two queries to execute at the same time,
 * both get 0 back, and then both insert into MongoDB.
 */

// dissalow inserting duplicate usernames even if validation
// plugin fails
userSchema.index({ username: 1 }, { unique: true });
userSchema.plugin(uniqueValidator);


userSchema.path('username').validate(
  value => (value.length >= 4),
  'Invalid username provided. Must have at least 4 characters',
);

userSchema.path('password').validate(
  value => (value.length >= 4),
  'Invalid password provided. Must have at least 4 characters',
);

userSchema.path('username').validate((value) => {
  const validCharacters = value.match(/^[a-zA-Z0-9_-]+$/);
  return validCharacters !== -1;
}, 'Invalid username provided. Only alphanumeric characters are supported');

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;

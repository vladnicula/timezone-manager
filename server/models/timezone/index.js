import mongoose from 'mongoose';

const timezoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
  },

  city: {
    type: String,
    required: true,
    minlength: 4,
  },

  offset: {
    type: Number,
    defalut: 0,
    min: -14,
    max: 14,
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
});

// disallow inserting duplicate fields by any means
timezoneSchema.index({ name: 1, userId: 1 }, { unique: true });

// userSchema.path('username').validate(
//   value => (value.length >= 4),
//   'Invalid username provided. Must have at least 4 characters',
// );

// userSchema.path('password').validate(
//   value => (value.length >= 4),
//   'Invalid password provided. Must have at least 4 characters',
// );

// userSchema.path('username').validate((value) => {
//   const validCharacters = value.match(/^[a-zA-Z0-9]+$/);
//   return validCharacters !== -1;
// }, 'Invalid username provided. Only alphanumeric characters are supported');

timezoneSchema.pre('save', function (next) {
  const { _id, name, userId } = this;
  mongoose.models.Timezone.findOne({ name, userId }, (err, results) => {
    if (err) {
      return next(err);
    } else if (results) { // there was a result found, so this would be a dupliccate
      if (results._id.toString() === _id.toString()) {
        return next();
      }
      this.invalidate('name', 'the name is already taken by another record owned by the same user');
      const error = new Error('Name UserId pair must be unique');
      error.name = 'ValidationError';
      error.errors = {
        name: 'the name is already taken by another record owned by the same user',
      };
      return next(error);
    }
    return next();
  });
});

const TimezoneModel = mongoose.model('Timezone', timezoneSchema);

export default TimezoneModel;

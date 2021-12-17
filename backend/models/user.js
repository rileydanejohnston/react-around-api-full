const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ErrorManager = require('../errors/error-manager');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /\w{4,5}\S{3,}/.test(v),
      message: 'Error! The link you entered is invalid.',
    },
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Error! The email you entered is invalid',
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false, // password hash isn't returned from DB by default
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password') // gets password hash from DB
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorManager(401, 'Incorrect password or email'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorManager(401, 'Incorrect password or email'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);

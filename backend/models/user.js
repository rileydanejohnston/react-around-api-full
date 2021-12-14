const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /\w{4,5}\S{3,}/.test(v),
      message: 'Error! The link you entered is invalid.',
    },
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Error! The email you entered is invalid'
    },
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 8,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);

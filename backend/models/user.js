const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('user', userSchema);

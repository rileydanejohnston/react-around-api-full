const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorManager = require('../errors/error-manager');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  Users.findByIdAndUpdate(_id, { avatar }, {
    new: true, // then handler receives updated document
    runValidators: true, // validate data before update
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        next(new ErrorManager(400, 'Update avatar failed. Invalid information was submitted.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // then handler receives updated document
    runValidators: true, // validate data before update
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManager(400, 'Update profile failed. Invalid information was submitted.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  Users.findById(_id)
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email,
      password: hash,
    }))
    // return everything except hashed password
    .then(({ name, about, avatar, email, _id }) => {
      res.status(201).send({
        data: {
          name,
          about,
          avatar,
          email,
          _id
        }
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManager(400, 'Create user failed. Invalid information was submitted.'));
      } else if (err.name === 'MongoServerError') {
        next(new ErrorManager(409, 'Create user failed. Email is already registered.'));
      }
      next(new ErrorManager(500));
    });
};

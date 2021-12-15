const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ErrorManager = require('../errors/error-manager');

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
        next(new ErrorManager(400, 'Invalid information was submitted.'));
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
        next(new ErrorManager(400, 'Invalid information was submitted.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .orFail()
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'Could not find any users.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'The user was not found.'));
      } else if (err.name === 'CastError') {
        next(new ErrorManager(400, 'Invalid user ID.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  Users.findById({ _id })
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((next(new ErrorManager(403, 'Invalid authorization.'))));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    // return everything except hashed password
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManager(400, 'Invalid information was submitted.'));
      }
      res.status(500).send({ message: err });
    });
};

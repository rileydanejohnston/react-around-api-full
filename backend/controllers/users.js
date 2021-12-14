const Users = require('../models/user');

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;

  Users.findByIdAndUpdate(_id, { avatar }, {
    new: true, // then handler receives updated document
    runValidators: true, // validate data before update
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        res.status(400).send({ message: 'Invalid information was submitted.' });
      }
      res.status(500).send({ message: err });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  Users.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // then handler receives updated document
    runValidators: true, // validate data before update
  })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid information was submitted.' });
      }
      res.status(500).send({ message: err });
    });
};

module.exports.getUsers = (req, res) => {
  Users.find({})
    .orFail()
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Could not find any users.' });
      }
      res.status(500).send({ message: err });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  Users.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'The card was not found.' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid card ID' });
      }
      res.status(500).send({ message: err });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  Users.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid information was submitted.' });
      }
      res.status(500).send({ message: err });
    });
};

const { Error } = require('mongoose');
const Cards = require('../models/card');
const ErrorManager = require('../errors/error-manager');

module.exports.dislikeCard = (req, res, next) => Cards.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true })
  .orFail()
  .then((likes) => res.status(200).send({ data: likes }))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      next(new ErrorManager(404, 'Dislike card failed. The card was not found.'));
    } else if (err.name === 'CastError') {
      next(new ErrorManager(400, 'Dislike card failed. The submitted card ID is an invalid ID number.'));
    }
    next(new ErrorManager(500));
  });

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true })
    .orFail()
    .then((likes) => res.status(200).send({ data: likes }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'Like card failed. The card was not found. '));
      } else if (err.name === 'CastError') {
        next(new ErrorManager(400, 'Like card failed. The submitted card ID is an invalid ID number.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .orFail()
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'Get cards failed. Could not find any cards.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Cards.create({ name, link, owner: _id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorManager(400, 'Create card failed. Invalid information was submitted.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findById(req.params.id)
    .orFail()
    .then(({ owner }) => {
      if (owner._id.toString() === req.user._id) {
        return Cards.findByIdAndRemove(req.params.id);
      }
      throw new Error('PermissionsError');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.message === 'PermissionsError') {
        next(new ErrorManager(403, 'Delete card failed. You are not the owner of this card.'));
      } else if (err.name === 'CastError') {
        next(new ErrorManager(400, 'Delete card failed. The submitted card ID is an invalid ID number.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'Delete card failed. Could not find that card.'));
      }
      next(new ErrorManager(500));
    });
};

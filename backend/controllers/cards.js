const Cards = require('../models/card');
const ErrorManager = require('../errors/error-manager');

module.exports.dislikeCard = (req, res, next) => Cards.findByIdAndUpdate(req.params.cardId,
  { $pull: { likes: req.user._id } }, // remove _id from the array
  { new: true })
  .orFail()
  .then((likes) => res.status(200).send({ data: likes }))
  .catch((err) => {
    if (err.name === 'DocumentNotFoundError') {
      next(new ErrorManager(404, 'The card was not found.'));
    } else if (err.name === 'CastError') {
      next(new ErrorManager(400, 'The submitted card ID is an invalid ID number.'));
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
        next(new ErrorManager(404, 'The card was not found.'));
      } else if (err.name === 'CastError') {
        next(new ErrorManager(400, 'The submitted card ID is an invalid ID number.'));
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
        next(new ErrorManager(404, 'Could not find any cards.'));
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
        next(new ErrorManager(400, 'Invalid information was submitted.'));
      }
      next(new ErrorManager(500));
    });
};

module.exports.deleteCard = (req, res, next) => {
  Cards.findByIdAndRemove(req.params.id)
    .orFail()
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorManager(400, 'Invalid user ID.'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new ErrorManager(404, 'Could not find that card.'));
      }
      next(new ErrorManager(500));
    });
};

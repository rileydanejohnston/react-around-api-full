const { celebrate, Joi } = require('celebrate');

module.exports.createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().regex(/\w{4,5}\S{3,}/),
  }),
});

module.exports.editCardLikeValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(20).required(),
  }),
});

module.exports.deleteCardValid = celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(2).required(),
  }),
});

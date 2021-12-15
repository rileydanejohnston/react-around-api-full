const { celebrate, Joi, validator } = require('celebrate');

function validateUrl(string) {
  return validator.isURL(string);
}

module.exports.editCardLikeValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(2).required(),
    // req.user._id?
  }),
});

module.exports.createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateUrl),
    // validate req.user._id?? how
  }),
});

module.exports.deleteCardValid = celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(2).required(),
  }),
});

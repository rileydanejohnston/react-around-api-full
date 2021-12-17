const { celebrate, Joi, validator } = require('celebrate');

/*
const validateUrl = (value, helpers) => {
  if (validator.isURL(value)){
    return value;
  }
  return helpers.error('string.uri');
}
*/

module.exports.editCardLikeValid = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().min(2).required(),
    // req.user._id?
  }),
});

module.exports.createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
    /*link: Joi.string().required().custom(validateUrl), */
  }),
});

module.exports.deleteCardValid = celebrate({
  params: Joi.object().keys({
    id: Joi.string().min(2).required(),
  }),
});

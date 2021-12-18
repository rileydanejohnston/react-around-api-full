const { celebrate, Joi } = require('celebrate');

/*
*** this was my implementation for the validator.isURL method per the lesson.
I could not get it to work for the life of me.
error-> "\"link\" failed custom validation because Cannot read property 'isURL' of undefined"
const { celebrate, Joi } = require('celebrate');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
}

module.exports.createCardValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateURL),
  }),
});
*/

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

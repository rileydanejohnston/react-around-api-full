const { celebrate, Joi } = require('celebrate');

module.exports.updateAvatarValid = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().min(8),
  }),
});

module.exports.updateProfileValid = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.loginValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
});

module.exports.signupValid = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
  }),
});

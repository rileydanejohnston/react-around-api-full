const jwt = require('jsonwebtoken');
const ErrorManager = require('../errors/error-manager');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    next(new ErrorManager(403, 'asdfasdf Authorization required'));
  }

  // extract token
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  }
  catch (err) {
    next(new ErrorManager(403, 'Authorization required'));
  }

  req.user = payload;
  next();
}
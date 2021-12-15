const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return res
      .status(403)
      .send({ message: 'Authorization required' });
  }

  // extract token
  const token = authorization.replace('Bearer ', '');

  // try extracting payload - user id?
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  }
  catch (err) {
    return res
      .status(403)
      .send({ message: 'Authorization required' });
  }

  req.user = payload;
  next();
}
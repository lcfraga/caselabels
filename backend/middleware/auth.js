const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader) {
    res.status(401).send();
    return;
  }

  const encodedToken = authorizationHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(encodedToken, process.env.TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).send();
  }
};

module.exports = auth;

const jwt = require('jsonwebtoken');

function createAuth({ tokenSecret }) {
  return (req, res, next) => {
    const authorizationHeader = req.header('Authorization');

    if (!authorizationHeader) {
      res.status(401).send();
      return;
    }

    const encodedToken = authorizationHeader.replace('Bearer ', '');

    try {
      const decodedToken = jwt.verify(encodedToken, tokenSecret);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).send();
    }
  };
}

module.exports = createAuth;

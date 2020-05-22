const jwt = require('jsonwebtoken')

function createJwtVerifier ({ publicEndpoints, tokenSecret }) {
  return (req, res, next) => {
    for (const endpoint of publicEndpoints) {
      if (endpoint.matches(req)) {
        next()
        return
      }
    }

    const authorizationHeader = req.header('Authorization')

    if (!authorizationHeader) {
      res.status(401).send()
      return
    }

    const encodedToken = authorizationHeader.replace('Bearer ', '')

    try {
      const decodedToken = jwt.verify(encodedToken, tokenSecret)
      req.user = decodedToken
      next()
    } catch (error) {
      res.status(401).send()
    }
  }
}

module.exports = createJwtVerifier

const jwt = require('jsonwebtoken')

function createJwtVerifier ({ publicEndpoints, jwtPublicKey, jwtAlgorithm, jwtIssuer, jwtAudience }) {
  return function jwtVerifier (req, res, next) {
    for (const endpoint of publicEndpoints) {
      if (endpoint.matches(req)) {
        next()
        return
      }
    }

    const encodedToken = req.cookies.token || ''

    const verifyOptions = {
      algorithms: [jwtAlgorithm],
      issuer: jwtIssuer,
      audience: jwtAudience
    }

    try {
      const decodedToken = jwt.verify(encodedToken, jwtPublicKey, verifyOptions)
      req.user = decodedToken
      next()
    } catch (error) {
      res.status(401).end()
    }
  }
}

module.exports = createJwtVerifier

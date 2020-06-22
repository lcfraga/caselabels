const jwt = require('jsonwebtoken')

function createJwtGenerator ({ jwtPrivateKey, jwtAlgorithm, jwtIssuer, jwtAudience }) {
  return (res, user, cookieName) => {
    const signOptions = {
      issuer: jwtIssuer,
      subject: `${user._id}`,
      audience: jwtAudience,
      //    expiresIn: '5m',
      algorithm: jwtAlgorithm
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name
      },
      jwtPrivateKey,
      signOptions
    )

    return res.cookie(cookieName, token, {
      // expires: new Date(Date.now() + expiresIn),
      secure: false,
      httpOnly: true
    })
  }
}

module.exports = createJwtGenerator

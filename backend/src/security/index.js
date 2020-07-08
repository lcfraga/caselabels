const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const env = require('../env')

async function passwordChecker (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword)
}

async function passwordHasher (password) {
  const salt = await bcrypt.genSalt()
  return await bcrypt.hash(password, salt)
}

function makeTokenGenerator ({ jwtPrivateKey, jwtAlgorithm, jwtIssuer, jwtAudience }) {
  return async function tokenGenerator (user) {
    const signOptions = {
      issuer: jwtIssuer,
      subject: `${user.id}`,
      audience: jwtAudience,
      //    expiresIn: '5m',
      algorithm: jwtAlgorithm
    }

    const token = await jwt.sign(
      {
        id: user.id,
        name: user.name
      },
      jwtPrivateKey,
      signOptions
    )

    return token
  }
}

module.exports = Object.freeze({
  passwordChecker,
  passwordHasher,
  tokenGenerator: makeTokenGenerator(env)
})

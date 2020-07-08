const makeSession = require('../models/session')

module.exports = function makeAddSession ({ usersDb, passwordChecker, tokenGenerator }) {
  return async function addSession (sessionData) {
    const session = await makeSession(sessionData)

    const user = await usersDb.findByEmail(session.getEmail())

    if (!user) {
      throw new Error('authentication failed')
    }

    const passwordMatches = await passwordChecker(session.getPassword(), user.password)

    if (!passwordMatches) {
      throw new Error('authentication failed')
    }

    const token = await tokenGenerator(user)

    return Object.freeze({
      data: {
        id: user.id,
        name: user.name
      },
      token
    })
  }
}

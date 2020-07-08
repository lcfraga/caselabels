const makeUser = require('../models/user')

module.exports = function makeAddUser ({ usersDb, passwordHasher }) {
  return async function addUser (userData) {
    const user = await makeUser(userData)

    const existingUser = await usersDb.findByEmail(user.getEmail())

    if (existingUser) {
      throw new Error('user exists')
    }

    const hashedPassword = await passwordHasher(user.getPassword())

    const { id, name, email } = await usersDb.insert(
      Object.freeze({
        id: user.getId(),
        name: user.getName(),
        email: user.getEmail(),
        password: hashedPassword
      })
    )

    return Object.freeze({
      id,
      name,
      email
    })
  }
}

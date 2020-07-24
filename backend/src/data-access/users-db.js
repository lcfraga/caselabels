function serialize (data) {
  if (!data) {
    return null
  }

  const { id, name, email, password } = data
  return { id, name, email, password }
}

function makeUsersDb (User) {
  return Object.freeze({
    findByEmail,
    insert,
    deleteAll
  })

  async function findByEmail (email) {
    const result = await User.findOne({ email }).exec()
    return serialize(result)
  }

  async function insert (userData) {
    const persistedUser = await User.create(userData)
    return serialize(persistedUser)
  }

  async function deleteAll () {
    await User.deleteMany()
  }
}

module.exports = makeUsersDb

module.exports = function buildMakeUser ({ userValidator, makeId }) {
  return function makeUser ({
    id = makeId(),
    name,
    email,
    password
  }) {
    const { error } = userValidator({ id, name, email, password })

    if (error) {
      throw new Error(error)
    }

    return Object.freeze({
      getId: () => id,
      getName: () => name,
      getEmail: () => email,
      getPassword: () => password
    })
  }
}

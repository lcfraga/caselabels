module.exports = function buildMakeSession ({ sessionValidator }) {
  return async function makeSession ({
    email,
    password
  }) {
    const { error } = sessionValidator({ email, password })

    if (error) {
      throw new Error(error)
    }

    return Object.freeze({
      getEmail: () => email,
      getPassword: () => password
    })
  }
}

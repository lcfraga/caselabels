module.exports = function buildMakeCase ({ caseValidator, makeId }) {
  return function makeCase ({
    id = makeId(),
    content
  }) {
    const { error } = caseValidator({ id, content })

    if (error) {
      throw new Error(error)
    }

    return Object.freeze({
      getId: () => id,
      getContent: () => content
    })
  }
}

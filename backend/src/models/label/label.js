module.exports = function buildMakeLabel ({ labelValidator }) {
  return function makeLabel ({
    code,
    description
  }) {
    const { error } = labelValidator({ code, description })

    if (error) {
      throw new Error(error)
    }

    return Object.freeze({
      getCode: () => code,
      getDescription: () => description
    })
  }
}

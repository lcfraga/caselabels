const { isCuid } = require('cuid')

function idValidator (value, helpers) {
  if (isCuid(value)) {
    return value
  }

  return helpers.error('any.invalid')
}

module.exports = idValidator

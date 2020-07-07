const Joi = require('joi')

const labelSchema = require('./label-schema')

function validator (payload, schema) {
  const { error } = Joi.validate(payload, schema, { abortEarly: false })

  if (error) {
    return Object.freeze({
      error: error.details.map(e => e.message)
    })
  }

  return true
}

module.exports = Object.freeze({
  labelValidator: (payload) => validator(payload, labelSchema)
})

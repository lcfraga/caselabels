const caseSchema = require('./case-schema')
const caseLabelSchema = require('./caselabel-schema')
const labelSchema = require('./label-schema')
const sessionSchema = require('./session-schema')
const userSchema = require('./user-schema')

function validator (payload, schema) {
  const { error } = schema.validate(payload, { abortEarly: false, convert: false })

  if (error) {
    return Object.freeze({
      error: error.details.map(e => e.message)
    })
  }

  return true
}

module.exports = Object.freeze({
  caseValidator: (payload) => validator(payload, caseSchema),
  labelValidator: (payload) => validator(payload, labelSchema),
  caseLabelValidator: (payload) => validator(payload, caseLabelSchema),
  sessionValidator: (payload) => validator(payload, sessionSchema),
  userValidator: (payload) => validator(payload, userSchema)
})

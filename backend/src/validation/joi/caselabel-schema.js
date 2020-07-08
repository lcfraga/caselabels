const Joi = require('@hapi/joi')

const idValidator = require('./id-validator')

module.exports = Joi.object().keys({
  id: Joi.string().required().custom(idValidator),
  caseId: Joi.string().required().custom(idValidator),
  userId: Joi.string().required().custom(idValidator),
  label: Joi.string().required().alphanum().length(3).uppercase(),
  durationInMillis: Joi.number().integer().required().positive()
})

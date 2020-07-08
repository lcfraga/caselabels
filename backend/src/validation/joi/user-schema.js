const Joi = require('@hapi/joi')

const idValidator = require('./id-validator')

module.exports = Joi.object().keys({
  id: Joi.string().required().custom(idValidator),
  name: Joi.string().required().min(1),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8).max(32)
})

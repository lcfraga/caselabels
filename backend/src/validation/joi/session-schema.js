const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required()
})

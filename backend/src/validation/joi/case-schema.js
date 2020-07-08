const Joi = require('@hapi/joi')

const idValidator = require('./id-validator')

module.exports = Joi.object().keys({
  id: Joi.string().required().custom(idValidator),
  content: Joi.string().required().min(50)
})

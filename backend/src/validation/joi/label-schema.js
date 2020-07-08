const Joi = require('@hapi/joi')

module.exports = Joi.object().keys({
  code: Joi.string().required().alphanum().length(3).uppercase(),
  description: Joi.string().required().min(10).max(100)
})

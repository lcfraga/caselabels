const Joi = require('joi')

module.exports = Joi.object().keys({
  code: Joi.string().required().error(() => 'code must be present'),
  description: Joi.string().required().error(() => 'description must be present')
})

const { v4: uuid } = require('uuid')

function setRequestContext (req, res, next) {
  req.context = {
    traceId: uuid()
  }

  next()
}

module.exports = setRequestContext

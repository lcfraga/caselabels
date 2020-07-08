const cuid = require('cuid')

function setRequestContext (req, res, next) {
  req.context = {
    traceId: cuid()
  }

  next()
}

module.exports = setRequestContext

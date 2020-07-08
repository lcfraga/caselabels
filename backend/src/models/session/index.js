const { sessionValidator } = require('../../validation')

const buildMakeSession = require('./session')

module.exports = buildMakeSession({ sessionValidator })

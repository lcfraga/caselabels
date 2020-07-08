const { userValidator } = require('../../validation')
const makeId = require('../id')

const buildMakeUser = require('./user')

module.exports = buildMakeUser({ userValidator, makeId })

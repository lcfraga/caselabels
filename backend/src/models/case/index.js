const { caseValidator } = require('../../validation')
const makeId = require('../id')

const buildMakeCase = require('./case')

module.exports = buildMakeCase({ caseValidator, makeId })

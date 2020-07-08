const { caseLabelValidator } = require('../../validation')
const makeId = require('../id')

const buildMakeCaseLabel = require('./caselabel')

module.exports = buildMakeCaseLabel({ caseLabelValidator, makeId })

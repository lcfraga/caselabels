const makeCaseModel = require('./case')
const makeCaseLabelModel = require('./caselabel')
const makeLabelModel = require('./label')
const makeUserModel = require('./user')

module.exports = Object.freeze({
  makeCaseModel,
  makeLabelModel,
  makeCaseLabelModel,
  makeUserModel
})

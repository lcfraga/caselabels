const mongoose = require('mongoose')

const env = require('../env')

const makeCaseLabelsDb = require('./caselabels-db')
const makeCasesDb = require('./cases-db')
const makeLabelsDb = require('./labels-db')
const dbModels = require('./models')
const makeUsersDb = require('./users-db')

if (env.databaseEnabled) {
  mongoose.connect(env.databaseUrl)

  mongoose.connection.once('open', function () {
    console.log('Mongoose connection open')
  }).on('error', function (error) {
    console.log('Mongoose connection error', error)
  }).on('disconnected', function () {
    console.log('Mongoose connection disconnected')
  })
}

const Case = dbModels.makeCaseModel(mongoose)
const Label = dbModels.makeLabelModel(mongoose)
const CaseLabel = dbModels.makeCaseLabelModel(mongoose)
const User = dbModels.makeUserModel(mongoose)

const casesDb = makeCasesDb(Case)
const labelsDb = makeLabelsDb(Label)
const caseLabelsDb = makeCaseLabelsDb(CaseLabel)
const usersDb = makeUsersDb(User)

module.exports = Object.freeze({
  casesDb,
  labelsDb,
  caseLabelsDb,
  usersDb
})

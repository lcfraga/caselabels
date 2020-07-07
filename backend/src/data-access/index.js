const mongoose = require('mongoose')

const env = require('../env')

const makeLabelsDb = require('./labels-db')
const dbModels = require('./models')

mongoose.connect(env.databaseUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.once('open', function () {
  console.log('Mongoose connection open')
}).on('error', function (error) {
  console.log('Mongoose connection error', error)
}).on('disconnected', function () {
  console.log('Mongoose connection disconnected')
})

const Label = dbModels.makeLabelModel(mongoose)
const labelsDb = makeLabelsDb(Label)

module.exports = Object.freeze({
  labelsDb
})

const mongoose = require('mongoose')

const caseLabelsApp = require('./caselabels')
const casesApp = require('./cases')
const labelsApp = require('./labels')
const usersApp = require('./users')

function connectDb (databaseUrl) {
  return mongoose.connect(databaseUrl,
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
}

function createConfig ({ env }) {
  const db = connectDb(env.databaseUrl)

  return {
    db,
    env,
    caseLabelsApp,
    casesApp,
    labelsApp,
    usersApp
  }
}

module.exports = createConfig

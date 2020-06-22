const mongoose = require('mongoose')

const caseLabelsApp = require('./caselabels')
const casesApp = require('./cases')
const createJwtGenerator = require('./express/jwt-generator')
const labelsApp = require('./labels')
const createUsersApp = require('./users')

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
  const jwtGenerator = createJwtGenerator(env)

  return {
    db,
    env,
    caseLabelsApp,
    casesApp,
    labelsApp,
    usersApp: createUsersApp(jwtGenerator)
  }
}

module.exports = createConfig

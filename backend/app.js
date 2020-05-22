const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const logger = require('morgan')

const env = require('./env')
const createAuth = require('./middleware/auth')
const caseLabelsRouter = require('./routes/caselabels')
const casesRouter = require('./routes/cases')
const labelsRouter = require('./routes/labels')
const usersRouter = require('./routes/users')

const app = express()

app.use(cors())
app.use(express.json())

if (env.enableLogger) {
  app.use(logger('dev'))
}

mongoose.connect(env.databaseUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const auth = createAuth(env)

app.use('/users', usersRouter)
app.use('/cases', auth, casesRouter)
app.use('/labels', auth, labelsRouter)
app.use('/caselabels', auth, caseLabelsRouter)

app.use((req, res) => {
  res.status(404).send()
})

app.listen(env.port, () => {
  console.log(`${env.appName}:${env.version} listening on port ${env.port}.`)
})

module.exports = app

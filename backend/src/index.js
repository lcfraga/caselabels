const env = require('./env')
const createExpressApp = require('./express')

const app = createExpressApp({ env })

function start () {
  app.listen(env.port, signalAppStart)
}

function signalAppStart () {
  console.log(`${env.appName}:${env.version} listening on port ${env.port}.`)
}

module.exports = { app, start }

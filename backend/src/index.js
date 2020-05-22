const createConfig = require('./config')
const env = require('./env')
const createExpressApp = require('./express')

const config = createConfig({ env })
const app = createExpressApp({ config, env })

function start () {
  app.listen(env.port, signalAppStart)
}

function signalAppStart () {
  console.log(`${env.appName}:${env.version} listening on port ${env.port}.`)
}

module.exports = { app, config, start }

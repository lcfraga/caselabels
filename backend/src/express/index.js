require('./tracer')('caselabels-backend')

const express = require('express')

const mountMetrics = require('./mount-metrics')
const mountMiddleware = require('./mount-middleware')
const mountRoutes = require('./mount-routes')

function createExpressApp ({ config, env }) {
  const app = express()

  mountMetrics(app, env)
  mountMiddleware(app, env)
  mountRoutes(app, env.pathPrefix, config)

  app.use((req, res, next) =>
    res.status(404).end()
  )

  return app
}

module.exports = createExpressApp

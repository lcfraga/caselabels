require('./tracer')('caselabels-backend')

const express = require('express')

const mountMetrics = require('./mount-metrics')
const mountMiddleware = require('./mount-middleware')
const mountRoutes = require('./mount-routes')

function createExpressApp ({ env }) {
  const app = express()

  mountMetrics(app, env)
  mountMiddleware(app, env)
  mountRoutes(app, env)

  return app
}

module.exports = createExpressApp

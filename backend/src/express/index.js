const express = require('express')

const mountMiddleware = require('./mount-middleware')
const mountRoutes = require('./mount-routes')

function createExpressApp ({ config, env }) {
  const app = express()

  mountMiddleware(app, env)
  mountRoutes(app, env.pathPrefix, config)

  app.use((req, res, next) =>
    res.status(404).end()
  )

  return app
}

module.exports = createExpressApp

const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const logger = require('morgan-body')

const createContentTypeEnforcer = require('./content-type-enforcer')
const createJwtVerifier = require('./jwt-verifier')
const setRequestContext = require('./set-request-context')

function mountMiddleware (app, env) {
  const contentTypeEnforcer = createContentTypeEnforcer(env)

  app.use(contentTypeEnforcer)
  app.use(cookieParser())

  app.use(cors({
    origin: env.corsOrigins,
    credentials: true
  }))

  app.use(express.json())

  if (env.loggerEnabled) {
    logger(app, {
      noColors: false,
      logAllReqHeader: true,
      logAllResHeader: true,
      filterParameters: ['password'],
      theme: 'dimmed'
    })
  }

  app.use(setRequestContext)

  if (env.jwtEnabled) {
    const jwtVerifier = createJwtVerifier(env)
    app.use(jwtVerifier)
  }
}

module.exports = mountMiddleware

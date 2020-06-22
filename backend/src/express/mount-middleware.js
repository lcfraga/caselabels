const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const logger = require('morgan')

const createJwtVerifier = require('./jwt-verifier')
const setRequestContext = require('./set-request-context')

function mountMiddleware (app, env) {
  app.use(cookieParser())

  app.use(cors({
    origin: true,
    credentials: true
  }))

  app.use(express.json())

  if (env.enableLogger) {
    app.use(logger('dev'))
  }

  const jwtVerifier = createJwtVerifier(env)

  app.use(setRequestContext)
  app.use(jwtVerifier)
}

module.exports = mountMiddleware

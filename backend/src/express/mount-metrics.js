const createMetricsMiddleware = require('express-prom-bundle')

function mountMetrics (app, env) {
  if (!env.metricsEnabled) {
    return
  }

  const metricsMiddleware = createMetricsMiddleware({
    metricsPath: env.metricsPath,
    includeStatusCode: true,
    includeMethod: true,
    includePath: true
  })

  app.use(metricsMiddleware)
}

module.exports = mountMetrics

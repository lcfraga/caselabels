const createMetricsMiddleware = require('express-prometheus-middleware')

function mountMetrics (app, env) {
  if (!env.metricsEnabled) {
    return
  }

  const metricsMiddleware = createMetricsMiddleware({
    metricsPath: env.metricsPath,
    collectDefaultMetrics: true,
    collectGCMetrics: false,
    prefix: env.metricsPrefix
  })

  app.use(metricsMiddleware)
}

module.exports = mountMetrics

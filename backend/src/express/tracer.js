const opentelemetry = require('@opentelemetry/api')
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger')
const { NodeTracerProvider } = require('@opentelemetry/node')
const { SimpleSpanProcessor } = require('@opentelemetry/tracing')

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    plugins: {
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express',
        ignoreLayersType: [
          'middleware',
          'request_handler',
          'router'
        ]
      },
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http'
      },
      mongodb: {
        enabled: true,
        path: '@opentelemetry/plugin-mongodb',
        enhancedDatabaseReporting: true
      }
    }
  })

  const exporter = new JaegerExporter({ serviceName })

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.register()

  return opentelemetry.trace.getTracer('caselabels-express')
}

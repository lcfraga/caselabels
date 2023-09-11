const opentelemetry = require('@opentelemetry/api')
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http')
const { registerInstrumentations } = require('@opentelemetry/instrumentation')
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express')
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http')
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb')
const { Resource } = require('@opentelemetry/resources')
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base')
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node')
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions')

module.exports = (serviceName) => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    })
  })

  const exporter = new OTLPTraceExporter()

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.register()

  registerInstrumentations({
    instrumentations: [
      new ExpressInstrumentation({ ignoreLayersType: ['request_handler', 'router'] }),
      new HttpInstrumentation(),
      new MongoDBInstrumentation()
    ]
  })

  return opentelemetry.trace.getTracer(serviceName)
}

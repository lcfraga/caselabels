const packageJson = require('../package.json')

function requireFromEnv (key, defaultValue = undefined) {
  if (!process.env[key] && (defaultValue === null || defaultValue === undefined)) {
    console.error(`[APP ERROR] Missing env variable:) ${key}`)

    return process.exit(1)
  }

  return process.env[key] || defaultValue
}

function isEnabled (key, defaultValue = true) {
  return requireFromEnv(key, defaultValue ? 'true' : 'false') === 'true'
}

function hasDestructiveEndpoints () {
  return isEnabled('ENABLE_DESTRUCTIVE_ENDPOINTS', false)
}

function parseCsv (csv) {
  return csv.split(',').map(x => x.trim())
}

class Endpoint {
  constructor ({ method, path, prefix }) {
    this.method = method
    this.path = path
    this.prefix = prefix
  }

  matches (other) {
    return this.method.toLowerCase() === other.method.toLowerCase() && `${this.prefix}${this.path}`.toLowerCase() === other.path.toLowerCase()
  }
}

function getPublicEndpoints () {
  const publicEndpoints = [
    new Endpoint({ method: 'POST', path: '/sessions', prefix: requireFromEnv('PATH_PREFIX', '') }),
    new Endpoint({ method: 'POST', path: '/users', prefix: requireFromEnv('PATH_PREFIX', '') })
  ]

  if (hasDestructiveEndpoints()) {
    publicEndpoints.push(
      new Endpoint({ method: 'DELETE', path: '/', prefix: requireFromEnv('PATH_PREFIX', '') })
    )
  }

  return publicEndpoints
}

module.exports = {
  allowedContentTypes: parseCsv(requireFromEnv('ALLOWED_CONTENT_TYPES', 'application/json')),
  appName: requireFromEnv('APP_NAME', packageJson.name),
  corsOrigins: parseCsv(requireFromEnv('CORS_ORIGINS', 'http://localhost')),
  databaseUrl: requireFromEnv('MONGO_URI', 'mongodb://caselabels:caselabels@localhost:27017/caselabels'),
  destructiveEndpointsEnabled: hasDestructiveEndpoints(),
  loggerEnabled: isEnabled('ENABLE_LOGGER'),
  port: parseInt(requireFromEnv('PORT', 3000), 10),
  publicEndpoints: getPublicEndpoints(),
  jwtEnabled: isEnabled('ENABLE_JWT'),
  jwtIssuer: requireFromEnv('JWT_ISSUER', 'caselabels.io'),
  jwtAudience: requireFromEnv('JWT_AUDIENCE', 'caselabels-ui'),
  jwtAlgorithm: requireFromEnv('JWT_ALGORITHM', 'RS256'),
  jwtPublicKey: requireFromEnv('JWT_PUBLIC_KEY'),
  jwtPrivateKey: requireFromEnv('JWT_PRIVATE_KEY'),
  metricsEnabled: isEnabled('ENABLE_METRICS'),
  metricsPath: requireFromEnv('METRICS_PATH', '/metrics'),
  metricsPrefix: requireFromEnv('METRICS_PREFIX', ''),
  pathPrefix: requireFromEnv('PATH_PREFIX', ''),
  version: packageJson.version
}

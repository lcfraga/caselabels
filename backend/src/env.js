const packageJson = require('../package.json')

function requireFromEnv (key, defaultValue = undefined) {
  if (!process.env[key] && !defaultValue) {
    console.error(`[APP ERROR] Missing env variable:) ${key}`)

    return process.exit(1)
  }

  return process.env[key] || defaultValue
}

function parseCsv (csv) {
  return csv.split(',').map(x => x.trim())
}

class Endpoint {
  constructor ({ method, path }) {
    this.method = method
    this.path = path
  }

  matches (other) {
    return this.method.toLowerCase() === other.method.toLowerCase() && this.path.toLowerCase() === other.path.toLowerCase()
  }
}

module.exports = {
  allowedContentTypes: parseCsv(requireFromEnv('ALLOWED_CONTENT_TYPES', 'application/json')),
  appName: requireFromEnv('APP_NAME', packageJson.name),
  corsOrigins: parseCsv(requireFromEnv('CORS_ORIGINS', 'http://localhost')),
  databaseUrl: requireFromEnv('MONGO_URI'),
  enableLogger: requireFromEnv('ENABLE_LOGGER', 'true') === 'true',
  port: parseInt(requireFromEnv('PORT', 3000), 10),
  publicEndpoints: [new Endpoint({ method: 'POST', path: '/users/login' })],
  jwtIssuer: requireFromEnv('JWT_ISSUER', 'caselabels.io'),
  jwtAudience: requireFromEnv('JWT_AUDIENCE', 'caselabels-ui'),
  jwtAlgorithm: requireFromEnv('JWT_ALGORITHM', 'RS256'),
  jwtPublicKey: requireFromEnv('JWT_PUBLIC_KEY'),
  jwtPrivateKey: requireFromEnv('JWT_PRIVATE_KEY'),
  version: packageJson.version
}

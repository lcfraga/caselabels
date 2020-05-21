const packageJson = require('./package.json');

function requireFromEnv(key, defaultValue = undefined) {
  if (!process.env[key] && !defaultValue) {
    console.error(`'[APP ERROR] Missing env variable:') ${key}`);

    return process.exit(1);
  }

  return process.env[key] || defaultValue;
}

module.exports = {
  appName: requireFromEnv('APP_NAME', packageJson.name),
  databaseUrl: requireFromEnv('MONGO_URI'),
  port: parseInt(requireFromEnv('PORT', 3000), 10),
  tokenSecret: requireFromEnv('TOKEN_SECRET'),
  version: packageJson.version
};

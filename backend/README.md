# caselabels-backend

HTTP JSON API with endpoints for user registration and authentication, case creation and retrieval, label creation and retrieval, and caselabel creation. It uses [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle) to provide a metrics endpoint compatible with Prometheus, and [OpenTelemetry](https://opentelemetry.io/) to send request traces to Jaeger.

The implementation tries to follow clean architecture principles, and is based on code from the following repositories:

* https://github.com/howardmann/clean-node
* https://github.com/dev-mastery/comments-api


## Minimum requirements

Node.js `20.6.1` must be installed. Consider using something like [nodenv](https://github.com/nodenv/nodenv) and [node-build](https://github.com/nodenv/node-build) to manage installed Node.js versions.


## Environment variables

It's possible to set/override the following environment variables to configure the application.

| Name                           | Default value                                                | Description                                                        |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| `APP_NAME`                     | `caselabels-backend`                                         | Used in the server's initial log message.                          |
| `ALLOWED_CONTENT_TYPES`        | `application/json`                                           | Comma-separated list of allowed content types.                     |
| `CORS_ORIGINS`                 | `http://localhost`                                           | Comma-separated list of allowed CORS origins.                      |
| `ENABLE_DB`                    | `true`                                                       | **Experimental!** Enables/disables the creation of a database connection.                      |
| `MONGO_URI`                    | `mongodb://caselabels:caselabels@localhost:27017/caselabels` | MongoDB URI.                                                       |
| `ENABLE_DESTRUCTIVE_ENDPOINTS` | `false`                                                      | Enables/disables the database reset endpoint used in system tests. |
| `ENABLE_LOGGER`                | `true`                                                       | Enables/disables the HTTP request/response logger.                 |
| `PORT`                         | `3000`                                                       | Port the server will listen on.                                    |
| `ENABLE_JWT`                   | `true`                                                       | Enables/disables JWT authentication.                               |
| `JWT_ISSUER`                   | `caselabels.io`                                              | JWT issuer claim.                                                  |
| `JWT_AUDIENCE`                 | `caselabels-ui`                                              | JWT audience claim.                                                |
| `JWT_ALGORITHM`                | `RS256`                                                      | JWT signature algorithm.                                           |
| `JWT_PUBLIC_KEY`               |                                                              | Public key for JWT signature algorithm.                            |
| `JWT_PRIVATE_KEY`              |                                                              | Private key for JWT signature algorithm.                           |
| `ENABLE_METRICS`               | `true`                                                       | Enables/disables metrics endpoint for Prometheus.                  |
| `METRICS_PATH`                 | `/metrics`                                                   | Mount path of metrics endpoint.                                    |
| `PATH_PREFIX`                  |                                                              | Mount prefix of application endpoints. Defaults to empty string.   |

Consider using a tool like [direnv](https://direnv.net/) to manage your environment variables.


## Generate private and public keys for JWT signing/verification

Run the code below to create a `caselabels-rs256.key` private key file and a `caselabels-rs256.key.pub` public key file.

```sh
ssh-keygen -t rsa -b 4096 -m PEM -f caselabels-rs256.key # Do not add passphrase.
openssl rsa -in caselabels-rs256.key -pubout -outform PEM -out caselabels-rs256.key.pub
```

Then, set the `JWT_PRIVATE_KEY` and `JWT_PUBLIC_KEY` environment variables to the contents of the `caselabels-rs256.key` and `caselabels-rs256.key.pub` files, respectively.


## Installing dependencies

Running `npm ci` will install the necessary dependencies.


## Running

First, we need to start MongoDB:

```sh
cd .. # Go back to repository root
script/docker/compose-dev up
```

Running `npm start` will start the backend. By default, it will be available at http://localhost:3000. Use the `PORT` environment variable to bind the server to another port, e.g., run `PORT=5000 npm start` to make the backend available at http://localhost:5000 instead.


## Checking code style

Run `npm run lint` to check for any code style issues.


## Running tests

Running `npm test` will run one JS test suite that checks content type enforcement. MongoDB does not have to be running.


## Running system tests

The system tests are black box tests – written in Kotlin – that require the backend and MongoDB to be running. A working JDK 11 must be installed. To run them:

```sh
cd test/system
./gradlew clean
./gradlew test
```

By default, system tests expect the backend to be available at http://localhost:3000. We can use the `HOST` and `PORT` environment variables to override that. For example, we can start the backend at another port with `PORT=5000 ENABLE_DESTRUCTIVE_ENDPOINTS=true npm start`, and then tell the tests to use that port instead:

```sh
cd test/system
./gradlew clean
PORT=5000 ./gradlew test
```

Notice that we have to use `ENABLE_DESTRUCTIVE_ENDPOINTS=true`. Otherwise, the database reset endpoint will be disabled and tests will fail.


## Create docker image

Run [`script/dockerize`](script/dockerize).

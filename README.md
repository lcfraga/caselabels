# caselabels

This repository was created as a playground to experiment with different languages – e.g., Kotlin – frameworks – e.g., express, kotest and ktor –, tools – e.g., Kubernetes, Prometheus, Grafana and Jaeger, and concepts – e.g., clean architecture.

See [frontend](frontend/README.md), [backend](backend/README.md) and [kubernetes](k8s/README.md) specific documentation.


## Minimum requirements

Node.js `12.18.2` must be installed. If you're using [nodenv](https://github.com/nodenv/nodenv) and [node-build](https://github.com/nodenv/node-build) to manage installed Node.js versions, all you have to do is run `nodenv install` in the repository root.

Recent versions of docker and docker-compose, e.g., docker `19.03.12` and docker-compose `1.26.2`, must also be installed.


## Running

The main docker composition requires the following ports to be available on the host:

| Docker service  | Host port |
| --------------- | --------- |
| `grafana`       |  `3000`   |
| `jaeger`        | `16686`   |
| `prometheus`    |  `9090`   |
| `reverse-proxy` |   `80`    |

If those ports are available, build the backend and frontend docker images and start the docker composition:

```sh
script/docker/build
script/docker/compose up
```

The React frontend will be available at http://localhost:80 and the jQuery frontend will be available at http://localhost:80/jquery/. You can register a new user, or use one of the 2 seeded users: `jsilver@jsilver.com` uses `password` as password and `hstevens@hstevens.com` uses `12345678`.

To use a different port for the frontend(s), e.g., port `8080`, the frontend code will have to be adjusted to point to a different backend URL – see [React](frontend/README.md) and [jQuery](frontend/jquery/README.md) documentation. Once the code adjustment is done, the frontend docker image has to be (re)created:

```sh
cd frontend
npm ci # If packages not already installed
script/dockerize
cd ..
```

Once that's done, we can use the `EXPOSED_REVERSE_PROXY_PORT` environment variable to override the host port at which the frontend service is exposed:

```sh
EXPOSED_REVERSE_PROXY_PORT=8080 script/docker/compose up
```


### Monitoring

The main docker composition also includes 3 monitoring services:

| Monitoring service                      | URL                    | Credentials   |
| --------------------------------------- | ---------------------- | ------------- |
| [Grafana](https://grafana.com/)         | http://localhost:3000  | `admin:admin` |
| [Jaeger](https://www.jaegertracing.io/) | http://localhost:16686 |               |
| [Prometheus](https://prometheus.io/)    | http://localhost:9090  |               |

You can use the `EXPOSED_GRAFANA_PORT`, `EXPOSED_JAEGER_PORT` and `EXPOSED_PROMETHEUS_PORT` environment variables to override the host ports at which the monitoring services are exposed. For example, to expose the Grafana frontend on port `3001` and the Prometheus frontend on port `9091`, run:

```
EXPOSED_GRAFANA_PORT=3001 EXPOSED_PROMETHEUS_PORT=9091 script/docker/compose up
```

Grafana starts with 2 provisioned dashboards: one for Jaeger and one for Prometheus.


## Running the Jenkins CI pipeline (only on Linux)

There's a continuous integration pipeline for the backend application. To run it, we have to start a Jenkins docker container that uses the host's docker: this means that all images available in the host are available in the Jenkins container. The Jenkins docker image is based on the one over at https://github.com/sudo-bmitch/jenkins-docker. Given the docker-in-docker context, it only works on Linux. It may work in other contexts, but it may be too complicated for the purpose of this project.

Since the pipeline times out after 15 minutes, it may be better to pull the images required by the build before running the pipeline:

```
docker pull mongo:3.6
docker pull node:lts-alpine
docker pull openjdk:11-jdk-slim
```

If the main docker composition is running, it may be better to stop it:

```
script/docker/compose down
```

Then, we can start the Jenkins docker composition:

```
script/docker/compose-jenkins up
```

Once it's up and running, go to http://localhost:8080/job/caselabels-backend/ and click _Scan Repository Now_ to start the pipeline. See [`backend/Jenkinsfile`](backend/Jenkinsfile) for details.


## Running MongoDB for development

When developing the frontend or the backend, it's likely we'll only use the MongoDB docker service. For that we can use the `dev` docker composition:

```
script/docker/compose-dev up
```

This will start MongoDB, which will be available at port `27017`, and the [mongo-express](https://github.com/mongo-express/mongo-express) frontend, which will be available at http://localhost:8081. You can use the `EXPOSED_MONGO_PORT`, and `EXPOSED_MONGO_EXPRESS_PORT` environment variables to override the host ports at which the database services are exposed. For example, to expose MongoDB on port `27018` and the mongo-express frontend on port `8082`, run:

```
EXPOSED_MONGO_PORT=27018 EXPOSED_MONGO_EXPRESS_PORT=8082 script/docker/compose-dev up
```

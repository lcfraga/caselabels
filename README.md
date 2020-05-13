# caselabels

Both the backend and the frontend were built using nodejs `12.16.3`.

## User credentials

There are 2 users: `jsilver@hospital.com` uses `password` as password and `hstevens@clinic.com` uses `12345678`.

## Running

```sh
cd backend
script/dockerize
cd ..
cd frontend
npm install
script/dockerize
cd ..
cd docker
docker-compose up
```

The React frontend will be running on `http://localhost:80` and the jQuery frontend will be running on `http://localhost:80/jquery/`. To use a different port, e.g., port `8080`, the `frontend/src/config.js` file must be changed to:

```js
const CONFIG = {
  BACKEND_API_URL: 'http://localhost:8080/api',
};

export default CONFIG;
```

And the first line of the `frontend/jquery/js/caselabels.jquery.js` file must be changed to:

```js
const BACKEND_API_URL = 'http://localhost:8080/api';
```

Then, the frontend docker image has to be (re)created:

```sh
cd frontend
npm install
script/dockerize
cd ..
```

Once that's done, we can run `docker-compose`:

```sh
cd docker
EXPOSED_NGINX_PORT=8080 docker-compose up
```

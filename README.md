# caselabels

Both the backend and the React frontend were built using nodejs `12.18.2`.

## User credentials

There are 2 users: `jsilver@jsilver.com` uses `password` as password and `hstevens@hstevens.com` uses `12345678`.

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

The React frontend will be running on `http://localhost:80` and the jQuery frontend will be running on `http://localhost:80/jquery/`. To use a different port, e.g., port `8080`, the [`frontend/src/config.js`](frontend/src/config.js) file must be changed to:

```js
const CONFIG = {
  BACKEND_API_URL: 'http://localhost:8080/api',
};

export default CONFIG;
```

And the first line of the [`frontend/jquery/caselabels.jquery.js`](frontend/jquery/caselabels.jquery.js) file must be changed to:

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
EXPOSED_REVERSE_PROXY_PORT=8080 docker-compose up
```

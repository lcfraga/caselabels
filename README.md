# caselabels

Both the backend and the frontend were built using nodejs `12.16.3`.

## User credentials

There are 2 users: `jsilver@hospital.com` has uses `password` as password and `hstevens@clinic.com` uses `12345678`.

## Running

```
cd backend
script/dockerize
cd ..
cd frontend
npm install
script/dockerize
..
cd docker
docker-compose up
```

The frontend will be running on `http://localhost:80`. To use a different port, e.g., port `8080`, run `EXPOSED_NGINX_PORT=8080 docker-compose up` instead.

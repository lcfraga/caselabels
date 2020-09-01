# caselabels-frontend

React frontend with forms to register users, log in and create caselabels. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). There's also a [jQuery frontend](jquery/README.md).


## Requirements

Node.js `12.18.2` must be installed. Consider using something like [nodenv](https://github.com/nodenv/nodenv) and [node-build](https://github.com/nodenv/node-build) to manage installed Node.js versions.


## Installing dependencies

Running `npm ci` will install the necessary dependencies.


## Running

Running `npm start` will start the frontend in development mode. By default, it will be available at http://localhost:3000. Use the `PORT` environment variable to bind the server to another port, e.g., run `PORT=5000 npm start` to make the frontend available at http://localhost:5000 instead. The page will reload if you make edits and any lint errors will be visible in the console.


## Packaging

Running `npm run build` builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.


## Create docker image

Run [`script/dockerize`](script/dockerize). Dependencies must be installed beforehand.


## Change backend URL

To use a different port, e.g., port `8080`, the [`src/config.js`](src/config.js) file must be changed to:

```js
const CONFIG = {
  BACKEND_API_URL: 'http://localhost:8080/api',
};

export default CONFIG;
```

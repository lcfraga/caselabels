# caselabels-frontend

jQuery frontend with forms to register users, log in and create caselabels. There's also a [React frontend](../README.md).


## Running

All we need is a server to serve the files in this directory. Use one of the following commands to make the frontend available at http://localhost:5000:

* `python -m SimpleHTTPServer 5000`, if using Python 2;
* `python3 -m http.server 5000`, if using Python 3;
* `ruby -run -e httpd . -p 5000`, if using Ruby.


## Change backend URL

To use a different port, e.g., port `8080`, the [`caselabels.jquery.js`](caselabels.jquery.js) file must be changed to:

```js
const BACKEND_API_URL = 'http://localhost:8080/api';
```


## Create docker image

Go to the parent directory with `cd ..` and run [`script/dockerize`](../script/dockerize).

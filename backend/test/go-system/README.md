# README

## Running tests

By default, the tests will run against http://localhost:3000. Use the `API_BASE_URL` environment variable to override the default URL, e.g., `API_BASE_URL=http://localhost:9999/api go test`.

### All tests

```sh
go test
# Altenatively
go test -v
```

## A specific test

```sh
go test -run "TestCreateSessionForUnknownUser"
# Altenatively
go test -v -run "TestCreateSessionForUnknownUser"
```

## A set of tests

```sh
go test -run "TestCreate(Valid|Invalid)Label"
# Altenatively
go test -v -run "TestCreate(Valid|Invalid)Label"
```

## TODO

* [ ] Try to remove apitest

## Removing apitest

* Comparing structs (expected vs actual response bodies) may help
* We'll probably still use jsonpath

```go
type TestEndpoint struct {
  Method string
  Path string
}

type TestRequest struct {
  Endpoint TestEndpoint
  Body any
  AuthToken string
}

type TestResponse struct {
  Body any
  StatusCode int
  CheckCookie bool
  CookieName string
  CookieValue string
}

type TestConfig struct {
  Request TestRequest
  Response TestResponse
}

func TestBla(t *testing.T) {
  // Perform request: endpoint(method, path) required, body optional, auth token optional
  // Examine response:
  // * status code
  // * body: error or happy
  // * cookie
}
```

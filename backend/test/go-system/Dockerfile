FROM golang:1.22.3-alpine AS build

WORKDIR /app
COPY go.* .
COPY *.go .
RUN go test -c -o system-tests

# -----------------------------------
FROM alpine

WORKDIR /app
COPY --from=build /app/system-tests .
CMD /app/system-tests

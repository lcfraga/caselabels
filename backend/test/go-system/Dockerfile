FROM golang:1.22.3-alpine AS build

WORKDIR /app
COPY go.* .
COPY *.go .
RUN go install github.com/jstemmer/go-junit-report/v2@latest
RUN go test -c -o system-tests
RUN cp `which go-junit-report` .

# -----------------------------------------------------------

FROM alpine

WORKDIR /app
COPY --from=build /app/system-tests .
COPY --from=build /app/go-junit-report .
CMD ./system-tests -test.v | ./go-junit-report -set-exit-code

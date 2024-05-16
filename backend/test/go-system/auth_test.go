package caselabels

import (
	"errors"
	"fmt"
	"net/http"
	"testing"
)

func TestPublicEndpointsArePublic(t *testing.T) {
	for action := range API.FilterEndpoints(true) {
		t.Run(fmt.Sprintf("Testing [%s]", action), func(t *testing.T) {
			API.RequestAndExpectStatus(t, action, http.StatusBadRequest)
		})
	}
}

func TestPrivateEndpointsArePrivate(t *testing.T) {
	for action := range API.FilterEndpoints(false) {
		t.Run(fmt.Sprintf("Testing [%s]", action), func(t *testing.T) {
			API.RequestAndExpectStatus(t, action, http.StatusUnauthorized)
		})
	}
}

func TestPrivateEndpointsAreAccessiblePrivately(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	statusCodeIsNotUnauthorized := func(res *http.Response, _ *http.Request) error {
		if res.StatusCode != http.StatusUnauthorized {
			return nil
		}
		return errors.New("expected status code != 401")
	}

	for action := range API.FilterEndpoints(false) {
		t.Run(fmt.Sprintf("Testing [%s]", action), func(t *testing.T) {
			API.AuthRequestAndAssert(t, action, authToken, statusCodeIsNotUnauthorized)
		})
	}
}

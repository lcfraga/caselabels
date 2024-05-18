package caselabels

import (
	"fmt"
	"net/http"
	"testing"

	jsonpath "github.com/steinfletcher/apitest-jsonpath"
)

func TestCreateInvalidSession(t *testing.T) {
	var (
		validEmail    = "bruno@caselabels.io"
		validPassword = "pa$$w0rd"
	)

	testCases := []struct {
		session  any
		errorMsg string
	}{
		{&CreateSessionRequestOmit{nil, &validPassword}, `\"email\" is required`},
		{&CreateSessionRequest{StringPtr(""), &validPassword}, `\"email\" is not allowed to be empty`},
		{&CreateSessionRequest{nil, &validPassword}, `\"email\" must be a string`},
		{&CreateSessionRequest{StringPtr("not-an-email"), &validPassword}, `\"email\" must be a valid email`},
		{&CreateSessionRequestOmit{&validEmail, nil}, `\"password\" is required`},
		{&CreateSessionRequest{&validEmail, StringPtr("")}, `\"password\" is not allowed to be empty`},
		{&CreateSessionRequest{&validEmail, nil}, `\"password\" must be a string`},
	}

	for _, testCase := range testCases {
		t.Run(fmt.Sprintf("Testing [%s]", testCase.errorMsg), func(t *testing.T) {
			API.RequestWithBodyAndExpectErrorAndStatus(
				t,
				API.Actions.CreateSession,
				testCase.session,
				testCase.errorMsg,
				http.StatusBadRequest,
			)
		})
	}
}

func TestCreateSessionForUnknownUser(t *testing.T) {
	API.Test(API.Actions.CreateSession).
		JSON(&CreateSessionRequest{StringPtr("unknown@caselabels.io"), StringPtr("anotherpasswod")}).
		Expect(t).
		Bodyf(`{"error":"%s"}`, "authentication failed").
		CookieNotPresent(API.AuthCookie).
		Status(http.StatusUnauthorized).
		End()
}

func TestCreateSessionForKnownUser(t *testing.T) {
	name, email, password := API.CreateSomeUser(t)

	API.Test(API.Actions.CreateSession).
		JSON(&CreateSessionRequest{&email, &password}).
		Expect(t).
		Assert(
			jsonpath.Chain().
				Equal("$.data.name", name).
				Present("$.data.id").
				End(),
		).
		CookiePresent(API.AuthCookie).
		Status(http.StatusCreated).
		End()
}

func TestDeleteSessionWithInvalidToken(t *testing.T) {
	API.CreateAndAuthenticateSomeUser(t)

	API.Test(API.Actions.DeleteSession).
		Cookie(API.AuthCookie, "invalid-token").
		Expect(t).
		CookieNotPresent(API.AuthCookie).
		Status(http.StatusUnauthorized).
		End()
}

func TestDeleteSessionWithValidToken(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	API.Test(API.Actions.DeleteSession).
		Cookie(API.AuthCookie, authToken).
		Expect(t).
		CookiePresent(API.AuthCookie).
		Status(http.StatusOK).
		End()
}

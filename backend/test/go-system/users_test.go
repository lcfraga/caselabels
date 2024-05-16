package caselabels

import (
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/google/uuid"
	jsonpath "github.com/steinfletcher/apitest-jsonpath"
)

func TestCreateInvalidUser(t *testing.T) {
	var (
		validName     = "Bianca Stevens"
		validEmail    = "bianca@caselabels.io"
		ValidPassword = "v4l1dp4s_"
	)

	testCases := []struct {
		user     *CreateUserRequest
		errorMsg string
	}{
		{&CreateUserRequest{StringPtr(""), &validEmail, &ValidPassword}, `\"name\" is not allowed to be empty`},
		{&CreateUserRequest{nil, &validEmail, &ValidPassword}, `\"name\" must be a string`},
		{&CreateUserRequest{&validName, StringPtr(""), &ValidPassword}, `\"email\" is not allowed to be empty`},
		{&CreateUserRequest{&validName, nil, &ValidPassword}, `\"email\" must be a string`},
		{&CreateUserRequest{&validName, StringPtr("invalid-email"), &ValidPassword}, `\"email\" must be a valid email`},
		{&CreateUserRequest{&validName, &validEmail, StringPtr("")}, `\"password\" is not allowed to be empty`},
		{&CreateUserRequest{&validName, &validEmail, nil}, `\"password\" must be a string`},
		{&CreateUserRequest{&validName, &validEmail, StringPtr(strings.Repeat("p", 7))}, `\"password\" length must be at least 8 characters long`},
		{&CreateUserRequest{&validName, &validEmail, StringPtr(strings.Repeat("p", 33))}, `\"password\" length must be less than or equal to 32 characters long`},
	}

	for _, testCase := range testCases {
		t.Run(fmt.Sprintf("Testing [%s]", testCase.errorMsg), func(t *testing.T) {
			API.RequestWithBodyAndExpectErrorAndStatus(
				t,
				API.Actions.CreateUser,
				testCase.user,
				testCase.errorMsg,
				http.StatusBadRequest,
			)
		})
	}
}

func TestCreateExistingUser(t *testing.T) {
	name, email, password := API.CreateSomeUser(t)

	API.RequestWithBodyAndExpectErrorAndStatus(
		t,
		API.Actions.CreateUser,
		&CreateUserRequest{&name, &email, &password},
		"user exists",
		http.StatusBadRequest,
	)
}

func TestCreateUser(t *testing.T) {
	name, password := uuid.New().String(), "password"
	email := fmt.Sprintf("%s@caselabels.io", name)

	API.Test(API.Actions.CreateUser).
		JSON(&CreateUserRequest{&name, &email, &password}).
		Expect(t).
		Assert(
			jsonpath.Chain().
				Equal("$.data.name", name).
				Equal("$.data.email", email).
				Present("$.data.id").
				End(),
		).
		Status(http.StatusCreated).
		End()
}

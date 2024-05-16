package caselabels

import (
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/google/uuid"
	jsonpath "github.com/steinfletcher/apitest-jsonpath"
)

func TestCreateInvalidCase(t *testing.T) {
	testCases := []struct {
		caze     *CreateCaseRequest
		errorMsg string
	}{
		{&CreateCaseRequest{StringPtr("")}, `\"content\" is not allowed to be empty`},
		{&CreateCaseRequest{nil}, `\"content\" must be a string`},
		{&CreateCaseRequest{StringPtr(strings.Repeat("s", 49))}, `\"content\" length must be at least 50 characters long`},
	}

	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	for _, testCase := range testCases {
		t.Run(fmt.Sprintf("Testing [%v]", testCase), func(t *testing.T) {
			API.AuthRequestWithBodyAndExpectErrorAndStatus(
				t,
				API.Actions.CreateCase,
				authToken,
				testCase.caze,
				testCase.errorMsg,
				http.StatusBadRequest,
			)
		})
	}
}

func TestCreateValidCase(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)

	assertCase := func() func(*http.Response, *http.Request) error {
		return jsonpath.Chain().
			Equal("$.data.content", content).
			Present("$.data.id").
			End()
	}()

	API.AuthRequestWithBodyAssertAndExpectStatus(
		t,
		API.Actions.CreateCase,
		authToken,
		&CreateCaseRequest{StringPtr(content)},
		assertCase,
		http.StatusCreated,
	)
}

func TestCreateValidCaseExists(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)

	API.CreateCase(t, authToken, content)

	API.AuthRequestWithBodyAndExpectErrorAndStatus(
		t,
		API.Actions.CreateCase,
		authToken,
		&CreateCaseRequest{&content},
		"case exists",
		http.StatusBadRequest,
	)
}

func TestGetNextCaseDoesNotExist(t *testing.T) {
	API.ResetDatabase(t)
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	API.AuthRequestAndExpectErrorAndStatus(
		t,
		API.Actions.GetNextCase,
		authToken,
		"not found",
		http.StatusNotFound,
	)
}

func TestGetNextCaseExistsAndIsLabelled(t *testing.T) {
	API.ResetDatabase(t)
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)

	caseId := API.CreateCase(t, authToken, content)
	label, durationInMillis := NextLabel(), 8271
	API.LabelCase(t, authToken, caseId, label, durationInMillis)

	API.AuthRequestAndExpectErrorAndStatus(
		t,
		API.Actions.GetNextCase,
		authToken,
		"not found",
		http.StatusNotFound,
	)
}

func TestGetNextCaseExistsAndIsNotLabelled(t *testing.T) {
	API.ResetDatabase(t)
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)

	caseId := API.CreateCase(t, authToken, content)

	assertCase := func() func(*http.Response, *http.Request) error {
		return jsonpath.Chain().
			Equal("$.data.id", caseId).
			Equal("$.data.content", content).
			End()
	}()

	API.AuthRequestAssertAndExpectStatus(
		t,
		API.Actions.GetNextCase,
		authToken,
		assertCase,
		http.StatusOK,
	)
}

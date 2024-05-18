package caselabels

import (
	"fmt"
	"net/http"
	"strings"
	"testing"

	jsonpath "github.com/steinfletcher/apitest-jsonpath"
)

func TestCreateInvalidLabel(t *testing.T) {
	var (
		validCode        = "A3D"
		validDescription = "A valid description."
	)

	testCases := []struct {
		label    any
		errorMsg string
	}{
		{&CreateLabelRequestOmit{nil, &validDescription}, `\"code\" is required`},
		{&CreateLabelRequest{StringPtr(""), &validDescription}, `\"code\" is not allowed to be empty`},
		{&CreateLabelRequest{nil, &validDescription}, `\"code\" must be a string`},
		{&CreateLabelRequest{StringPtr("aaa"), &validDescription}, `\"code\" must only contain uppercase characters`},
		{&CreateLabelRequest{StringPtr("A/B"), &validDescription}, `\"code\" must only contain alpha-numeric characters`},
		{&CreateLabelRequest{StringPtr("AA"), &validDescription}, `\"code\" length must be 3 characters long`},
		{&CreateLabelRequest{StringPtr("ZZZZ"), &validDescription}, `\"code\" length must be 3 characters long`},
		{&CreateLabelRequestOmit{&validCode, nil}, `\"description\" is required`},
		{&CreateLabelRequest{&validCode, StringPtr("")}, `\"description\" is not allowed to be empty`},
		{&CreateLabelRequest{&validCode, nil}, `\"description\" must be a string`},
		{&CreateLabelRequest{&validCode, StringPtr(strings.Repeat("a", 9))}, `\"description\" length must be at least 10 characters long`},
		{&CreateLabelRequest{&validCode, StringPtr(strings.Repeat("a", 101))}, `\"description\" length must be less than or equal to 100 characters long`},
	}

	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	for _, testCase := range testCases {
		t.Run(fmt.Sprintf("Testing [%s]", testCase.errorMsg), func(t *testing.T) {
			API.AuthRequestWithBodyAndExpectErrorAndStatus(
				t,
				API.Actions.CreateLabel,
				authToken,
				testCase.label,
				testCase.errorMsg,
				http.StatusBadRequest,
			)
		})
	}
}

func TestCreateValidLabel(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	label, description := NextLabel(), "Describing and so on."

	assertLabel := func() func(*http.Response, *http.Request) error {
		return jsonpath.Chain().
			Equal("$.data.code", label).
			Equal("$.data.description", description).
			End()
	}()

	API.AuthRequestWithBodyAssertAndExpectStatus(
		t,
		API.Actions.CreateLabel,
		authToken,
		&CreateLabelRequest{&label, &description},
		assertLabel,
		http.StatusCreated,
	)
}

func TestCreateValidLabelExists(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	label, description := NextLabel(), "Describing and so on."
	API.CreateLabel(t, authToken, label, description)

	API.AuthRequestWithBodyAndExpectErrorAndStatus(
		t,
		API.Actions.CreateLabel,
		authToken,
		&CreateLabelRequest{&label, &description},
		"label exists",
		http.StatusBadRequest,
	)
}

func TestGetEmptyLabels(t *testing.T) {
	API.ResetDatabase(t)
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	API.AuthTest(API.Actions.ListLabels, authToken).
		Expect(t).
		Body(`{"data":[]}`).
		Status(http.StatusOK).
		End()
}

func TestGetLabels(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	labels := map[string]string{
		NextLabel(): "it is quite nice",
		NextLabel(): "it is indeed not bad",
		NextLabel(): "sure it is good",
	}

	for code, desc := range labels {
		API.CreateLabel(t, authToken, code, desc)
	}

	assertLabels := func() func(*http.Response, *http.Request) error {
		chain := jsonpath.Chain()
		for code, desc := range labels {
			chain = chain.Contains(fmt.Sprintf(`$.data[?@.code=="%s"].description`, code), desc)
		}
		return chain.End()
	}()

	API.AuthTest(API.Actions.ListLabels, authToken).
		Expect(t).
		Assert(jsonpath.GreaterThan("$.data", len(labels))).
		Assert(assertLabels).
		Status(http.StatusOK).
		End()
}

package caselabels

import (
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/google/uuid"
	jsonpath "github.com/steinfletcher/apitest-jsonpath"
)

func TestInvalidCaseLabelling(t *testing.T) {
	var (
		validCaseId   = "ckd8v7v6c00bffy23c7zl8gny"
		validLabel    = "LBL"
		validDuration = 1234
	)

	testCases := []struct {
		labelling any
		errorMsg  string
	}{
		{&LabelCaseRequestOmit{nil, &validLabel, &validDuration}, `\"caseId\" is required`},
		{&LabelCaseRequest{nil, &validLabel, &validDuration}, `\"caseId\" must be a string`},
		{&LabelCaseRequest{StringPtr(""), &validLabel, &validDuration}, `\"caseId\" is not allowed to be empty`},
		{&LabelCaseRequest{StringPtr("invalid-cuid"), &validLabel, &validDuration}, `\"caseId\" contains an invalid value`},
		{&LabelCaseRequest{&validCaseId, nil, &validDuration}, `\"label\" must be a string`},
		{&LabelCaseRequestOmit{&validCaseId, nil, &validDuration}, `\"label\" is required`},
		{&LabelCaseRequest{&validCaseId, StringPtr(""), &validDuration}, `\"label\" is not allowed to be empty`},
		{&LabelCaseRequest{&validCaseId, StringPtr("lbl"), &validDuration}, `\"label\" must only contain uppercase characters`},
		{&LabelCaseRequest{&validCaseId, StringPtr("/*;"), &validDuration}, `\"label\" must only contain alpha-numeric characters`},
		{&LabelCaseRequest{&validCaseId, StringPtr("LB"), &validDuration}, `\"label\" length must be 3 characters long`},
		{&LabelCaseRequest{&validCaseId, StringPtr("LBLB"), &validDuration}, `\"label\" length must be 3 characters long`},
		{&LabelCaseRequestOmit{&validCaseId, &validLabel, nil}, `\"durationInMillis\" is required`},
		{&LabelCaseRequest{&validCaseId, &validLabel, nil}, `\"durationInMillis\" must be a number`},
		{&LabelCaseRequest{&validCaseId, &validLabel, IntPtr(0)}, `\"durationInMillis\" must be a positive number`},
		{&LabelCaseRequest{&validCaseId, &validLabel, IntPtr(-1)}, `\"durationInMillis\" must be a positive number`},
	}

	authToken, _ := API.CreateAndAuthenticateSomeUser(t)

	for _, testCase := range testCases {
		t.Run(fmt.Sprintf("Testing [%v]", testCase), func(t *testing.T) {
			API.AuthRequestWithBodyAndExpectErrorAndStatus(
				t,
				API.Actions.LabelCase,
				authToken,
				testCase.labelling,
				testCase.errorMsg,
				http.StatusBadRequest,
			)
		})
	}
}

func TestValidCaseLabelling(t *testing.T) {
	authToken, userId := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)
	caseId := API.CreateCase(t, authToken, content)
	durationInMillis := 5548
	label := NextLabel()

	assertCaseLabelling := func() func(*http.Response, *http.Request) error {
		return jsonpath.Chain().
			Present("$.data.id").
			Equal("$.data.caseId", caseId).
			Equal("$.data.userId", userId).
			Equal("$.data.label", label).
			Equal("$.data.durationInMillis", float64(durationInMillis)).
			End()
	}()

	API.AuthRequestWithBodyAssertAndExpectStatus(
		t,
		API.Actions.LabelCase,
		authToken,
		&LabelCaseRequest{&caseId, &label, &durationInMillis},
		assertCaseLabelling,
		http.StatusCreated,
	)
}

func TestValidCaseLabellingExists(t *testing.T) {
	authToken, _ := API.CreateAndAuthenticateSomeUser(t)
	content := strings.Repeat(uuid.New().String(), 2)
	caseId := API.CreateCase(t, authToken, content)
	label, durationInMillis := NextLabel(), 4321

	API.LabelCase(t, authToken, caseId, label, 4321)

	API.AuthRequestWithBodyAndExpectErrorAndStatus(
		t,
		API.Actions.LabelCase,
		authToken,
		&LabelCaseRequest{&caseId, &label, &durationInMillis},
		"case label exists",
		http.StatusBadRequest,
	)
}

package caselabels

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/steinfletcher/apitest"
)

type APIPaths struct {
	ResetDB    string
	Users      string
	Labels     string
	Cases      string
	CasesNext  string
	CaseLabels string
	Sessions   string
}

type APIActions struct {
	CreateUser    string
	CreateSession string
	DeleteSession string
	CreateCase    string
	GetNextCase   string
	CreateLabel   string
	ListLabels    string
	LabelCase     string
}

type APIEndpoint struct {
	Method   string
	Path     string
	IsPublic bool
}

type APIConfig struct {
	ContentType string
	AuthCookie  string
	BaseURL     string
	Paths       APIPaths
	Actions     APIActions
	Endpoints   map[string]APIEndpoint
	Client      *http.Client
}

func (api *APIConfig) URL(path string) string {
	return fmt.Sprintf("%s%s", API.BaseURL, path)
}

func (api *APIConfig) ObservableTest(action string, observers ...apitest.Observe) *apitest.Request {
	endpoint := api.Endpoints[action]
	return apitest.New().
		Observe(observers...).
		EnableNetworking(api.Client).
		Method(endpoint.Method).
		ContentType(API.ContentType).
		URL(API.URL(endpoint.Path))
}

func (api *APIConfig) Test(action string) *apitest.Request {
	return API.ObservableTest(action)
}

func (api *APIConfig) AuthObservableTest(action string, authToken string, observers ...apitest.Observe) *apitest.Request {
	return API.ObservableTest(action, observers...).
		Cookie(API.AuthCookie, authToken)
}

func (api *APIConfig) AuthTest(action string, authToken string) *apitest.Request {
	return API.AuthObservableTest(action, authToken)
}

func (api *APIConfig) ResetDatabase(t *testing.T) {
	apitest.New().
		EnableNetworking(api.Client).
		Method(http.MethodDelete).
		ContentType(API.ContentType).
		URL(API.URL(API.Paths.ResetDB)).
		Expect(t).
		Status(http.StatusOK).
		End()
}

func (api *APIConfig) CreateUser(t *testing.T, name string, email string, password string) {
	API.Test(API.Actions.CreateUser).
		JSON(&CreateUserRequest{&name, &email, &password}).
		Expect(t).
		Status(http.StatusCreated).
		End()
}

func (api *APIConfig) CreateSomeUser(t *testing.T) (string, string, string) {
	name := uuid.New().String()
	email, password := fmt.Sprintf("%s@users.com", name), name[:32]
	api.CreateUser(t, name, email, password)
	return name, email, password
}

func (api *APIConfig) AuthenticateUser(t *testing.T, email string, password string) (string, string) {
	var authToken, userId string

	API.ObservableTest(
		API.Actions.CreateSession,
		func(res *http.Response, req *http.Request, apiTest *apitest.APITest) {
			authToken = res.Cookies()[0].Value
			userId = decodeToken(authToken).Id
		},
	).
		JSON(&CreateSessionRequest{&email, &password}).
		Expect(t).
		Status(http.StatusCreated).
		End()

	return authToken, userId
}

func (api *APIConfig) CreateAndAuthenticateSomeUser(t *testing.T) (string, string) {
	_, email, password := api.CreateSomeUser(t)
	return api.AuthenticateUser(t, email, password)
}

func (api *APIConfig) CreateLabel(t *testing.T, authToken string, code string, description string) {
	API.AuthTest(API.Actions.CreateLabel, authToken).
		JSON(&CreateLabelRequest{&code, &description}).
		Expect(t).
		Status(http.StatusCreated).
		End()
}

func (api *APIConfig) CreateCase(t *testing.T, authToken string, content string) string {
	var caseId string

	API.AuthObservableTest(
		API.Actions.CreateCase,
		authToken,
		func(res *http.Response, req *http.Request, apiTest *apitest.APITest) {
			resBody := &ResponseWithId{}
			decodeResponse(res, resBody)
			caseId = resBody.Data.Id
		},
	).
		JSON(&CreateCaseRequest{&content}).
		Expect(t).
		Status(http.StatusCreated).
		End()

	return caseId
}

func (api *APIConfig) LabelCase(t *testing.T, authToken string, caseId string, label string, durationInMillis int) string {
	var caseLabellingId string

	API.AuthObservableTest(
		API.Actions.LabelCase,
		authToken,
		func(res *http.Response, req *http.Request, apiTest *apitest.APITest) {
			resBody := &ResponseWithId{}
			decodeResponse(res, resBody)
			caseLabellingId = resBody.Data.Id
		},
	).
		JSON(&LabelCaseRequest{&caseId, &label, &durationInMillis}).
		Expect(t).
		Status(http.StatusCreated).
		End()

	return caseLabellingId
}

func (api *APIConfig) FilterEndpoints(public bool) map[string]APIEndpoint {
	res := make(map[string]APIEndpoint)
	for action, endpoint := range api.Endpoints {
		if endpoint.IsPublic == public {
			res[action] = endpoint
		}
	}
	return res
}

func (api *APIConfig) RequestAndExpectStatus(t *testing.T, action string, statusCode int) {
	API.Test(action).
		Expect(t).
		Status(statusCode).
		End()
}

func (api *APIConfig) RequestAndAssert(
	t *testing.T,
	action string,
	assert func(*http.Response, *http.Request) error,
) {
	API.Test(action).
		Expect(t).
		Assert(assert).
		End()
}

func (api *APIConfig) RequestWithBodyAndExpectErrorAndStatus(
	t *testing.T,
	action string,
	body interface{},
	errorMsg string,
	statusCode int,
) {
	API.Test(action).
		JSON(body).
		Expect(t).
		Bodyf(`{"error":"%s"}`, errorMsg).
		Status(statusCode).
		End()
}

func (api *APIConfig) AuthRequestAndExpectErrorAndStatus(
	t *testing.T,
	action string,
	authToken string,
	errorMsg string,
	statusCode int,
) {
	API.AuthTest(action, authToken).
		Expect(t).
		Bodyf(`{"error":"%s"}`, errorMsg).
		Status(statusCode).
		End()
}

func (api *APIConfig) AuthRequestWithBodyAndExpectErrorAndStatus(
	t *testing.T,
	action string,
	authToken string,
	body interface{},
	errorMsg string,
	statusCode int,
) {
	API.AuthTest(action, authToken).
		JSON(body).
		Expect(t).
		Bodyf(`{"error":"%s"}`, errorMsg).
		Status(statusCode).
		End()
}

func (api *APIConfig) AuthRequestWithBodyAssertAndExpectStatus(
	t *testing.T,
	action string,
	authToken string,
	body interface{},
	assert func(*http.Response, *http.Request) error,
	statusCode int,
) {
	API.AuthTest(action, authToken).
		JSON(body).
		Expect(t).
		Assert(assert).
		Status(statusCode).
		End()
}

func (api *APIConfig) AuthRequestAssertAndExpectStatus(
	t *testing.T,
	action string,
	authToken string,
	assert func(*http.Response, *http.Request) error,
	statusCode int,
) {
	API.AuthTest(action, authToken).
		Expect(t).
		Assert(assert).
		Status(statusCode).
		End()
}

func (api *APIConfig) AuthRequestAndAssert(
	t *testing.T,
	action string,
	authToken string,
	assert func(*http.Response, *http.Request) error,
) {
	API.AuthTest(action, authToken).
		Expect(t).
		Assert(assert).
		End()
}

type JwtPayload struct {
	Id string `json:"id"`
}

type CreateUserRequestOmit struct {
	Name     *string `json:"name,omitempty"`
	Email    *string `json:"email,omitempty"`
	Password *string `json:"password,omitempty"`
}

type CreateUserRequest struct {
	Name     *string `json:"name"`
	Email    *string `json:"email"`
	Password *string `json:"password"`
}

type CreateSessionRequestOmit struct {
	Email    *string `json:"email,omitempty"`
	Password *string `json:"password,omitempty"`
}

type CreateSessionRequest struct {
	Email    *string `json:"email"`
	Password *string `json:"password"`
}

type CreateLabelRequestOmit struct {
	Code        *string `json:"code,omitempty"`
	Description *string `json:"description,omitempty"`
}

type CreateLabelRequest struct {
	Code        *string `json:"code"`
	Description *string `json:"description"`
}

type CreateCaseRequestOmit struct {
	Content *string `json:"content,omitempty"`
}

type CreateCaseRequest struct {
	Content *string `json:"content"`
}

type LabelCaseRequestOmit struct {
	CaseId           *string `json:"caseId,omitempty"`
	Label            *string `json:"label,omitempty"`
	DurationInMillis *int    `json:"durationInMillis,omitempty"`
}

type LabelCaseRequest struct {
	CaseId           *string `json:"caseId"`
	Label            *string `json:"label"`
	DurationInMillis *int    `json:"durationInMillis"`
}

type ResponseWithId struct {
	Data struct {
		Id string `json:"id"`
	} `json:"data"`
}

var actions = APIActions{
	CreateUser:    "create-user",
	CreateSession: "create-session",
	DeleteSession: "delete-session",
	CreateCase:    "create-case",
	GetNextCase:   "get-next-case",
	CreateLabel:   "create-label",
	ListLabels:    "list-labels",
	LabelCase:     "label-case",
}

var paths = APIPaths{
	ResetDB:    "/",
	Users:      "/users",
	Labels:     "/labels",
	Cases:      "/cases",
	CasesNext:  "/cases/next",
	CaseLabels: "/caselabels",
	Sessions:   "/sessions",
}

var API = APIConfig{
	ContentType: "application/json",
	AuthCookie:  "token",
	BaseURL:     GetenvOrDefault("API_BASE_URL", "http://localhost:3000"),
	Paths:       paths,
	Actions:     actions,
	Endpoints: map[string]APIEndpoint{
		actions.CreateUser:    {http.MethodPost, paths.Users, true},
		actions.CreateSession: {http.MethodPost, paths.Sessions, true},
		actions.CreateCase:    {http.MethodPost, paths.Cases, false},
		actions.GetNextCase:   {http.MethodGet, paths.CasesNext, false},
		actions.CreateLabel:   {http.MethodPost, paths.Labels, false},
		actions.ListLabels:    {http.MethodGet, paths.Labels, false},
		actions.LabelCase:     {http.MethodPost, paths.CaseLabels, false},
		actions.DeleteSession: {http.MethodDelete, paths.Sessions, false},
	},
	Client: &http.Client{
		Timeout: time.Second * 1,
	},
}

func GetenvOrDefault(key string, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func decodeToken(authToken string) *JwtPayload {
	tokens := strings.Split(authToken, ".")
	decoded, err := base64.RawURLEncoding.DecodeString(tokens[1])
	if err != nil {
		panic(err)
	}
	payload := &JwtPayload{}
	err = json.Unmarshal(decoded, payload)
	if err != nil {
		panic(err)
	}
	return payload
}

func decodeResponse(res *http.Response, resBody any) {
	err := json.NewDecoder(res.Body).Decode(resBody)
	if err != nil {
		panic(err)
	}
}

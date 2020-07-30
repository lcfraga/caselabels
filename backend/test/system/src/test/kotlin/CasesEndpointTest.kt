import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie
import io.ktor.util.KtorExperimentalAPI

data class PostCaseRequestWithoutContent(
    val notContent: String = "ignored by backend"
)

data class PostCaseRequest(
    val content: String? = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
)

data class PostCaseResponse(
    val id: String,
    val content: String = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
)

@KtorExperimentalAPI
class CasesEndpointTest : DescribeSpec({

    listener(DatabaseResetTestListener())

    var cookie = Cookie(name = "", value = "")

    beforeTest {
        Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest())
        cookie = Backend.rawPostSession(PostSessionRequest()).setCookie()[0]
    }

    describe("POST /cases") {

        listOf(
            row(
                "when content is absent",
                PostCaseRequestWithoutContent(),
                BackendErrorMessage(error = """"content" is required""")
            ),
            row(
                "when content is null",
                PostCaseRequest(content = null),
                BackendErrorMessage(error = """"content" must be a string""")
            ),
            row(
                "when content is empty",
                PostCaseRequest(content = ""),
                BackendErrorMessage(error = """"content" is not allowed to be empty""")
            ),
            row(
                "when content has less than 50 characters",
                PostCaseRequest(content = "a".repeat(49)),
                BackendErrorMessage(error = """"content" length must be at least 50 characters long""")
            )
        ).map { (context: String, body, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postCase(requestBody = body, cookie = cookie)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        describe("when payload is valid and case does not exist") {
            it("responds with 201 Created and payload with id") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostCaseResponse>> = Backend.postCase(
                    requestBody = PostCaseRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Created,
                    body = BackendResponseBodyWrapper(
                        data = PostCaseResponse(id = actualResponse.body.data.id)
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when payload is valid and case exists") {
            beforeTest {
                Backend.postCase<BackendResponseBodyWrapper<PostCaseResponse>>(
                    requestBody = PostCaseRequest(),
                    cookie = cookie
                )
            }

            it("responds with 400 Bad Request and error message: case exists") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postCase(
                    requestBody = PostCaseRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.BadRequest,
                    body = BackendErrorMessage(error = "case exists")
                )

                actualResponse shouldBe expectedResponse
            }
        }
    }

    describe("GET /cases/next") {
        describe("when case does not exist") {
            it("responds with 404 Not Found and error message: not found") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.getNextCase(cookie)

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.NotFound,
                    body = BackendErrorMessage(error = "not found")
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when case exists") {
            var caseId = ""

            beforeTest {
                caseId = Backend.postCase<BackendResponseBodyWrapper<PostCaseResponse>>(
                    requestBody = PostCaseRequest(),
                    cookie = cookie
                ).body.data.id
            }

            describe("when user has not reviewed case") {
                it("responds with 200 OK and case payload") {
                    val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostCaseResponse>> = Backend.getNextCase(cookie)

                    val expectedResponse = BackendResponse(
                        statusCode = HttpStatusCode.OK,
                        body = BackendResponseBodyWrapper(
                            data = PostCaseResponse(id = caseId)
                        )
                    )

                    actualResponse shouldBe expectedResponse
                }
            }

            describe("when user has reviewed case") {
                beforeTest {
                    Backend.postCaseLabel<BackendResponseBodyWrapper<PostCaseLabelResponse>>(
                        requestBody = PostCaseLabelRequest(
                            caseId = caseId
                        ),
                        cookie = cookie
                    )
                }

                it("responds with 404 Not Found and error message: not found") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.getNextCase(cookie)

                    val expectedResponse = BackendResponse(
                        statusCode = HttpStatusCode.NotFound,
                        body = BackendErrorMessage(error = "not found")
                    )

                    actualResponse shouldBe expectedResponse
                }
            }
        }
    }

})

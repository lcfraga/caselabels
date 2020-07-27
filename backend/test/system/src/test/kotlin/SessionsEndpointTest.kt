import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.client.statement.HttpResponse
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie

data class PostSessionRequestWithoutEmail(
    val password: String = "p4ssw0rd"
)

data class PostSessionRequestWithoutPassword(
    val email: String = "lara@clark.com"
)

data class PostSessionRequest(
    val email: String? = "lara@clark.com",
    val password: String? = "p4sswOrd"
)

data class PostSessionResponse(
    val id: String,
    val name: String = "Lara Clark"
)

class SessionsEndpointTest : DescribeSpec({

    listener(DatabaseResetTestListener())

    describe("POST /sessions") {

        listOf(
            row(
                "when email is absent",
                PostSessionRequestWithoutEmail(),
                BackendErrorMessage(error = """"email" is required""")
            ),
            row(
                "when password is absent",
                PostSessionRequestWithoutPassword(),
                BackendErrorMessage(error = """"password" is required""")
            )
        ).map { (context: String, body, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postSession(body)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        listOf(
            row(
                "when email is null",
                PostSessionRequest(email = null),
                BackendErrorMessage(error = """"email" must be a string""")
            ),
            row(
                "when email is empty",
                PostSessionRequest(email = ""),
                BackendErrorMessage(error = """"email" is not allowed to be empty""")
            ),
            row(
                "when email is not a valid email",
                PostSessionRequest(email = "not an email"),
                BackendErrorMessage(error = """"email" must be a valid email""")
            ),
            row(
                "when password is null",
                PostSessionRequest(password = null),
                BackendErrorMessage(error = """"password" must be a string""")
            ),
            row(
                "when password is empty",
                PostSessionRequest(password = ""),
                BackendErrorMessage(error = """"password" is not allowed to be empty""")
            )
        ).map { (context: String, body: PostSessionRequest, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postSession(body)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        describe("when payload is valid and user does not exist") {
            it("responds with 401 Unauthorized and error message: authentication failed") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postSession(PostSessionRequest())

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Unauthorized,
                    body = BackendErrorMessage(error = "authentication failed")
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when payload is valid and user exists") {
            beforeTest {
                Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest())
            }

            it("responds with 201 Created and payload with id") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostSessionResponse>> = Backend.postSession(PostSessionRequest())

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Created,
                    body = BackendResponseBodyWrapper(
                        data = PostSessionResponse(id = actualResponse.body.data.id)
                    )
                )

                actualResponse shouldBe expectedResponse
            }

            it("responds with JWT in HTTP-only cookie named token") {
                val actualResponse: HttpResponse = Backend.rawPostSession(PostSessionRequest())
                val actualCookies = actualResponse.setCookie()

                val expectedCookies = listOf(
                    Cookie(
                        path = "/",
                        name = "token",
                        value = actualCookies[0].value,
                        httpOnly = true
                    )
                )

                actualCookies shouldBe expectedCookies
            }
        }
    }

})

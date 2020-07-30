import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.http.HttpStatusCode

data class PostUserRequestWithoutName(
    val email: String = "lara@clark.com",
    val password: String = "p4ssw0rd"
)

data class PostUserRequestWithoutEmail(
    val name: String = "Lara Clark",
    val password: String = "p4ssw0rd"
)

data class PostUserRequestWithoutPassword(
    val name: String = "Lara Clark",
    val email: String = "lara@clark.com"
)

data class PostUserRequest(
    val name: String? = "Lara Clark",
    val email: String? = "lara@clark.com",
    val password: String? = "p4sswOrd"
)

data class PostUserResponse(
    val id: String,
    val name: String = "Lara Clark",
    val email: String = "lara@clark.com"
)

class UsersEndpointTest : DescribeSpec({

    listener(DatabaseResetTestListener())

    describe("POST /users") {

        listOf(
            row(
                "when name is absent",
                PostUserRequestWithoutName(),
                BackendErrorMessage(error = """"name" is required""")
            ),
            row(
                "when name is null",
                PostUserRequest(name = null),
                BackendErrorMessage(error = """"name" must be a string""")
            ),
            row(
                "when name is empty",
                PostUserRequest(name = ""),
                BackendErrorMessage(error = """"name" is not allowed to be empty""")
            ),
            row(
                "when email is absent",
                PostUserRequestWithoutEmail(),
                BackendErrorMessage(error = """"email" is required""")
            ),
            row(
                "when email is null",
                PostUserRequest(email = null),
                BackendErrorMessage(error = """"email" must be a string""")
            ),
            row(
                "when email is empty",
                PostUserRequest(email = ""),
                BackendErrorMessage(error = """"email" is not allowed to be empty""")
            ),
            row(
                "when email is not a valid email",
                PostUserRequest(email = "not an email"),
                BackendErrorMessage(error = """"email" must be a valid email""")
            ),
            row(
                "when password is absent",
                PostUserRequestWithoutPassword(),
                BackendErrorMessage(error = """"password" is required""")
            ),
            row(
                "when password is null",
                PostUserRequest(password = null),
                BackendErrorMessage(error = """"password" must be a string""")
            ),
            row(
                "when password is empty",
                PostUserRequest(password = ""),
                BackendErrorMessage(error = """"password" is not allowed to be empty""")
            ),
            row(
                "when password has less than 8 characters",
                PostUserRequest(password = "a".repeat(7)),
                BackendErrorMessage(error = """"password" length must be at least 8 characters long""")
            ),
            row(
                "when password has more than 32 characters",
                PostUserRequest(password = "a".repeat(33)),
                BackendErrorMessage(error = """"password" length must be less than or equal to 32 characters long""")
            )
        ).map { (context: String, body, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postUser(body)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        describe("when payload is valid and user does not exist") {
            it("responds with 201 Created and user payload") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostUserResponse>> = Backend.postUser(PostUserRequest())

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Created,
                    body = BackendResponseBodyWrapper(
                        data = PostUserResponse(id = actualResponse.body.data.id)
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when payload is valid and user exists") {
            beforeTest {
                Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest())
            }

            it("responds with 400 Bad Request and error message: user exists") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postUser(PostUserRequest())

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.BadRequest,
                    body = BackendErrorMessage(error = "user exists")
                )

                actualResponse shouldBe expectedResponse
            }
        }
    }

})

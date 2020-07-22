import io.kotest.core.spec.autoClose
import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.client.call.receive
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpStatusCode

data class RegistrationRequestWithoutName(val email: String = "lara@clark.com", val password: String = "p4ssw0rd")
data class RegistrationRequestWithoutEmail(val name: String = "Lara Clark", val password: String = "p4ssw0rd")
data class RegistrationRequestWithoutPassword(val name: String = "Lara Clark", val email: String = "lara@clark.com")

data class RegistrationRequest(
    val name: String? = "Lara Clark",
    val email: String? = "lara@clark.com",
    val password: String? = "p4sswOrd"
)

data class ErrorMessage(val error: String)

class UsersEndpointTest : DescribeSpec({

    val backend = autoClose(Backend.getInstance())

    describe("POST /users") {

        listOf(
            row(
                "when name is absent",
                RegistrationRequestWithoutName(),
                ErrorMessage(error = """"name" is required""")
            ),
            row(
                "when email is absent",
                RegistrationRequestWithoutEmail(),
                ErrorMessage(error = """"email" is required""")
            ),
            row(
                "when password is absent",
                RegistrationRequestWithoutPassword(),
                ErrorMessage(error = """"password" is required""")
            )
        ).map { (context: String, body, expectedError: ErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val httpResponse = backend.post<HttpResponse>(path = "/users", body = body)
                    val actualError = httpResponse.receive<ErrorMessage>()

                    httpResponse.status shouldBe HttpStatusCode.BadRequest
                    actualError shouldBe expectedError
                }
            }

        }

        listOf(
            row(
                "when name is null",
                RegistrationRequest(name = null),
                ErrorMessage(error = """"name" must be a string""")
            ),
            row(
                "when name is empty",
                RegistrationRequest(name = ""),
                ErrorMessage(error = """"name" is not allowed to be empty""")
            ),
            row(
                "when email is null",
                RegistrationRequest(email = null),
                ErrorMessage(error = """"email" must be a string""")
            ),
            row(
                "when email is empty",
                RegistrationRequest(email = ""),
                ErrorMessage(error = """"email" is not allowed to be empty""")
            ),
            row(
                "when email is not a valid email",
                RegistrationRequest(email = "not an email"),
                ErrorMessage(error = """"email" must be a valid email""")
            ),
            row(
                "when password is null",
                RegistrationRequest(password = null),
                ErrorMessage(error = """"password" must be a string""")
            ),
            row(
                "when password is empty",
                RegistrationRequest(password = ""),
                ErrorMessage(error = """"password" is not allowed to be empty""")
            ),
            row(
                "when password has less than 8 characters",
                RegistrationRequest(password = "a".repeat(7)),
                ErrorMessage(error = """"password" length must be at least 8 characters long""")
            ),
            row(
                "when password has more than 32 characters",
                RegistrationRequest(password = "a".repeat(33)),
                ErrorMessage(error = """"password" length must be less than or equal to 32 characters long""")
            )
        ).map { (context: String, body: RegistrationRequest, expectedError: ErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val httpResponse = backend.post<HttpResponse>(path = "/users", body = body)
                    val actualError = httpResponse.receive<ErrorMessage>()

                    httpResponse.status shouldBe HttpStatusCode.BadRequest
                    actualError shouldBe expectedError
                }
            }

        }
    }

})

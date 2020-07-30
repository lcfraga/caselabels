import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie
import io.ktor.util.KtorExperimentalAPI

data class PostLabelRequestWithoutCode(
    val description: String = "optical SAS microchip programming"
)

data class PostLabelRequestWithoutDescription(
    val code: String = "HIN"
)

data class PostLabelRequest(
    val code: String? = "HIN",
    val description: String? = "optical SAS microchip programming"
)

data class PostLabelResponse(
    val code: String = "HIN",
    val description: String = "optical SAS microchip programming"
)

@KtorExperimentalAPI
class LabelsEndpointTest : DescribeSpec({

    listener(DatabaseResetTestListener())

    var cookie = Cookie(name = "", value = "")

    beforeTest {
        Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest())
        cookie = Backend.rawPostSession(PostSessionRequest()).setCookie()[0]
    }

    describe("POST /labels") {

        listOf(
            row(
                "when code is absent",
                PostLabelRequestWithoutCode(),
                BackendErrorMessage(error = """"code" is required""")
            ),
            row(
                "when code is null",
                PostLabelRequest(code = null),
                BackendErrorMessage(error = """"code" must be a string""")
            ),
            row(
                "when code is empty",
                PostLabelRequest(code = ""),
                BackendErrorMessage(error = """"code" is not allowed to be empty""")
            ),
            row(
                "when code has lowercase characters",
                PostLabelRequest(code = "aaa"),
                BackendErrorMessage(error = """"code" must only contain uppercase characters""")
            ),
            row(
                "when code has non-alphanumeric characters",
                PostLabelRequest(code = "A/B"),
                BackendErrorMessage(error = """"code" must only contain alpha-numeric characters""")
            ),
            row(
                "when code has less than 3 characters",
                PostLabelRequest(code = "AA"),
                BackendErrorMessage(error = """"code" length must be 3 characters long""")
            ),
            row(
                "when code has more than 3 characters",
                PostLabelRequest(code = "AAAA"),
                BackendErrorMessage(error = """"code" length must be 3 characters long""")
            ),
            row(
                "when description is absent",
                PostLabelRequestWithoutDescription(),
                BackendErrorMessage(error = """"description" is required""")
            ),
            row(
                "when description is null",
                PostLabelRequest(description = null),
                BackendErrorMessage(error = """"description" must be a string""")
            ),
            row(
                "when description is empty",
                PostLabelRequest(description = ""),
                BackendErrorMessage(error = """"description" is not allowed to be empty""")
            ),
            row(
                "when description has less than 10 characters",
                PostLabelRequest(description = "a".repeat(9)),
                BackendErrorMessage(error = """"description" length must be at least 10 characters long""")
            ),
            row(
                "when description has more than 32 characters",
                PostLabelRequest(description = "a".repeat(101)),
                BackendErrorMessage(error = """"description" length must be less than or equal to 100 characters long""")
            )
        ).map { (context: String, body, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postLabel(requestBody = body, cookie = cookie)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        describe("when payload is valid and label does not exist") {
            it("responds with 201 Created and label payload") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostLabelResponse>> = Backend.postLabel(
                    requestBody = PostLabelRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Created,
                    body = BackendResponseBodyWrapper(
                        data = PostLabelResponse()
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when payload is valid and label exists") {
            beforeTest {
                Backend.postLabel<BackendResponseBodyWrapper<PostLabelResponse>>(
                    requestBody = PostLabelRequest(),
                    cookie = cookie
                )
            }

            it("responds with 400 Bad Request and error message: label exists") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postLabel(
                    requestBody = PostLabelRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.BadRequest,
                    body = BackendErrorMessage(error = "label exists")
                )

                actualResponse shouldBe expectedResponse
            }
        }
    }

    describe("GET /labels") {
        describe("when labels do not exist") {
            it("responds with 200 OK and empty list of labels") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<List<PostLabelResponse>>> = Backend.getLabels(cookie)

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.OK,
                    body = BackendResponseBodyWrapper(
                        data = emptyList<PostLabelResponse>()
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when labels exist") {
            beforeTest {
                Backend.postLabel<BackendResponseBodyWrapper<PostLabelResponse>>(
                    requestBody = PostLabelRequest(code = "BBB"),
                    cookie = cookie
                )

                Backend.postLabel<BackendResponseBodyWrapper<PostLabelResponse>>(
                    requestBody = PostLabelRequest(code = "AAA"),
                    cookie = cookie
                )
            }

            it("responds with 200 OK and list of labels sorted by code") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<List<PostLabelResponse>>> = Backend.getLabels(cookie)

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.OK,
                    body = BackendResponseBodyWrapper(
                        data = listOf(
                            PostLabelResponse(code = "AAA"),
                            PostLabelResponse(code = "BBB")
                        )
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }
    }

})

import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.shouldBe
import io.ktor.http.Cookie
import io.ktor.http.HttpStatusCode
import io.ktor.http.setCookie
import io.ktor.util.KtorExperimentalAPI

data class PostCaseLabelRequestWithoutCaseId(
    val label: String = "HIN",
    val durationInMillis: Int = 1234
)

data class PostCaseLabelRequestWithoutLabel(
    val caseId: String = "ckd8v7v6c00bffy23c7zl8gny",
    val durationInMillis: Int = 1234
)

data class PostCaseLabelRequestWithoutDurationInMillis(
    val caseId: String = "ckd8v7v6c00bffy23c7zl8gny",
    val label: String = "HIN"
)

data class PostCaseLabelRequest(
    val caseId: String? = "ckd8v7v6c00bffy23c7zl8gny",
    val label: String? = "HIN",
    val durationInMillis: Int? = 1234
)

data class PostCaseLabelResponse(
    val id: String,
    val caseId: String = "ckd8v7v6c00bffy23c7zl8gny",
    val userId: String,
    val label: String = "HIN",
    val durationInMillis: Int = 1234
)

@KtorExperimentalAPI
class CaseLabelsEndpointTest : DescribeSpec({

    listener(DatabaseResetTestListener())

    var cookie = Cookie(name = "", value = "")
    var userId = ""

    beforeTest {
        userId = Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest()).body.data.id
        cookie = Backend.rawPostSession(PostSessionRequest()).setCookie()[0]
    }

    describe("POST /caselabels") {

        listOf(
            row(
                "when caseId is absent",
                PostCaseLabelRequestWithoutCaseId(),
                BackendErrorMessage(error = """"caseId" is required""")
            ),
            row(
                "when caseId is null",
                PostCaseLabelRequest(caseId = null),
                BackendErrorMessage(error = """"caseId" must be a string""")
            ),
            row(
                "when caseId is empty",
                PostCaseLabelRequest(caseId = ""),
                BackendErrorMessage(error = """"caseId" is not allowed to be empty""")
            ),
            row(
                "when caseId is not a valid cuid",
                PostCaseLabelRequest(caseId = "invalid-cuid"),
                BackendErrorMessage(error = """"caseId" contains an invalid value""")
            ),
            row(
                "when label is absent",
                PostCaseLabelRequestWithoutLabel(),
                BackendErrorMessage(error = """"label" is required""")
            ),
            row(
                "when label is null",
                PostCaseLabelRequest(label = null),
                BackendErrorMessage(error = """"label" must be a string""")
            ),
            row(
                "when label is empty",
                PostCaseLabelRequest(label = ""),
                BackendErrorMessage(error = """"label" is not allowed to be empty""")
            ),
            row(
                "when label has lowercase characters",
                PostCaseLabelRequest(label = "aaa"),
                BackendErrorMessage(error = """"label" must only contain uppercase characters""")
            ),
            row(
                "when label has non-alphanumeric characters",
                PostCaseLabelRequest(label = "A/B"),
                BackendErrorMessage(error = """"label" must only contain alpha-numeric characters""")
            ),
            row(
                "when label has less than 3 characters",
                PostCaseLabelRequest(label = "AA"),
                BackendErrorMessage(error = """"label" length must be 3 characters long""")
            ),
            row(
                "when label has more than 3 characters",
                PostCaseLabelRequest(label = "AAAA"),
                BackendErrorMessage(error = """"label" length must be 3 characters long""")
            ),
            row(
                "when durationInMillis is absent",
                PostCaseLabelRequestWithoutDurationInMillis(),
                BackendErrorMessage(error = """"durationInMillis" is required""")
            ),
            row(
                "when durationInMillis is null",
                PostCaseLabelRequest(durationInMillis = null),
                BackendErrorMessage(error = """"durationInMillis" must be a number""")
            ),
            row(
                "when durationInMillis is negative",
                PostCaseLabelRequest(durationInMillis = -1),
                BackendErrorMessage(error = """"durationInMillis" must be a positive number""")
            ),
            row(
                "when durationInMillis is zero",
                PostCaseLabelRequest(durationInMillis = 0),
                BackendErrorMessage(error = """"durationInMillis" must be a positive number""")
            )
        ).map { (context: String, body, expectedError: BackendErrorMessage) ->

            describe(context) {
                it("responds with 400 Bad Request and error message: ${expectedError.error}") {
                    val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postCaseLabel(requestBody = body, cookie = cookie)
                    val expectedResponse = BackendResponse(statusCode = HttpStatusCode.BadRequest, body = expectedError)

                    actualResponse shouldBe expectedResponse
                }
            }

        }

        describe("when payload is valid and case label does not exist") {
            it("responds with 201 Created and case label payload") {
                val actualResponse: BackendResponse<BackendResponseBodyWrapper<PostCaseLabelResponse>> = Backend.postCaseLabel(
                    requestBody = PostCaseLabelRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.Created,
                    body = BackendResponseBodyWrapper(
                        data = PostCaseLabelResponse(
                            id = actualResponse.body.data.id,
                            userId = userId
                        )
                    )
                )

                actualResponse shouldBe expectedResponse
            }
        }

        describe("when payload is valid and case label exists") {
            beforeTest {
                Backend.postCaseLabel<BackendResponseBodyWrapper<PostCaseLabelResponse>>(
                    requestBody = PostCaseLabelRequest(),
                    cookie = cookie
                )
            }

            it("responds with 400 Bad Request and error message: case label exists") {
                val actualResponse: BackendResponse<BackendErrorMessage> = Backend.postCaseLabel(
                    requestBody = PostCaseLabelRequest(),
                    cookie = cookie
                )

                val expectedResponse = BackendResponse(
                    statusCode = HttpStatusCode.BadRequest,
                    body = BackendErrorMessage(error = "case label exists")
                )

                actualResponse shouldBe expectedResponse
            }
        }
    }

})

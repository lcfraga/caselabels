import io.kotest.core.spec.style.DescribeSpec
import io.kotest.data.row
import io.kotest.matchers.should
import io.ktor.client.request.header
import io.ktor.client.request.request
import io.ktor.client.statement.HttpResponse
import io.ktor.http.*
import io.ktor.util.KtorExperimentalAPI

@KtorExperimentalAPI
class AuthorizationTest : DescribeSpec({

    data class AuthorizationTestParameters(
        val httpMethod: HttpMethod,
        val path: String,
        val responseStatus: HttpStatusCode = HttpStatusCode.Unauthorized
    )

    listener(DatabaseResetSpecListener())

    val client = Backend.getInstance()
    var cookie = Cookie(name = "", value = "")

    beforeSpec {
        Backend.postUser<BackendResponseBodyWrapper<PostUserResponse>>(PostUserRequest())
        cookie = Backend.rawPostSession(PostSessionRequest()).setCookie()[0]
    }

    describe("when endpoint is public") {
        listOf(
            row(
                AuthorizationTestParameters(
                    httpMethod = HttpMethod.Post,
                    path = "/sessions",
                    responseStatus = HttpStatusCode.BadRequest
                )
            ),
            row(
                AuthorizationTestParameters(
                    httpMethod = HttpMethod.Post,
                    path = "/users",
                    responseStatus = HttpStatusCode.BadRequest
                )
            )
        ).map { (testParameters: AuthorizationTestParameters) ->

            describe("when ${testParameters.httpMethod.value} ${testParameters.path}") {
                it("responds with ${testParameters.responseStatus}") {
                    val response: HttpResponse = client.request {
                        method = testParameters.httpMethod
                        url {
                            encodedPath = BackendConfig.prefixed(testParameters.path)
                        }
                    }

                    response should haveStatus(testParameters.responseStatus)
                }
            }

        }
    }

    describe("when endpoint is private") {
        describe("when user is unauthenticated") {

            listOf(
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/cases"
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Get,
                        path = "/cases/next"
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/labels"
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Get,
                        path = "/labels"
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/caselabels"
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Delete,
                        path = "/sessions"
                    )
                )
            ).map { (testParameters: AuthorizationTestParameters) ->

                describe("when ${testParameters.httpMethod.value} ${testParameters.path}") {
                    it("responds with ${testParameters.responseStatus}") {
                        val response: HttpResponse = client.request {
                            method = testParameters.httpMethod
                            url {
                                encodedPath = BackendConfig.prefixed(testParameters.path)
                            }
                        }

                        response should haveStatus(testParameters.responseStatus)
                    }
                }

            }
        }

        describe("when user is authenticated") {

            listOf(
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/cases",
                        responseStatus = HttpStatusCode.BadRequest
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/caselabels",
                        responseStatus = HttpStatusCode.BadRequest
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Post,
                        path = "/labels",
                        responseStatus = HttpStatusCode.BadRequest
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Get,
                        path = "/cases/next",
                        responseStatus = HttpStatusCode.NotFound
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Get,
                        path = "/labels",
                        responseStatus = HttpStatusCode.OK
                    )
                ),
                row(
                    AuthorizationTestParameters(
                        httpMethod = HttpMethod.Delete,
                        path = "/sessions",
                        responseStatus = HttpStatusCode.OK
                    )
                )
            ).map { (testParameters: AuthorizationTestParameters) ->

                describe("when ${testParameters.httpMethod.value} ${testParameters.path}") {
                    it("responds with ${testParameters.responseStatus}") {
                        val response: HttpResponse = client.request {
                            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
                            method = testParameters.httpMethod
                            url {
                                encodedPath = BackendConfig.prefixed(testParameters.path)
                            }
                        }

                        response should haveStatus(testParameters.responseStatus)
                    }
                }

            }
        }
    }

})

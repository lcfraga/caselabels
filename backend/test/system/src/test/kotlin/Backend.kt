import io.ktor.client.HttpClient
import io.ktor.client.call.receive
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.*
import io.ktor.client.statement.HttpResponse
import io.ktor.http.*
import io.ktor.util.KtorExperimentalAPI

data class BackendResponse<T>(val statusCode: HttpStatusCode, val body: T)

data class BackendResponseBodyWrapper<T>(val data: T)

data class BackendErrorMessage(val error: String)

object BackendConfig {
  val port = Environment.getVariable("PORT", "3000").toInt()
  val host = Environment.getVariable("HOST", "localhost")
  private val prefix = Environment.getVariable("PREFIX", "")

  fun prefixed(path: String = ""): String = prefix + path
}

object Backend {

    private val client = HttpClient(Apache) {
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }

        expectSuccess = false

        defaultRequest {
            host = BackendConfig.host
            port = BackendConfig.port
            contentType(ContentType.Application.Json)
        }
    }

    fun getInstance(): HttpClient {
        return client
    }

    @KtorExperimentalAPI
    suspend inline fun <reified T> postCase(requestBody: Any, cookie: Cookie): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().post(path = BackendConfig.prefixed("/cases"), body = requestBody) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    @KtorExperimentalAPI
    suspend inline fun <reified T> getNextCase(cookie: Cookie): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().get(path = BackendConfig.prefixed("/cases/next")) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    @KtorExperimentalAPI
    suspend inline fun <reified T> postLabel(requestBody: Any, cookie: Cookie): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().post(path = BackendConfig.prefixed("/labels"), body = requestBody) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    @KtorExperimentalAPI
    suspend inline fun <reified T> getLabels(cookie: Cookie): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().get(path = BackendConfig.prefixed("/labels")) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    @KtorExperimentalAPI
    suspend inline fun <reified T> postCaseLabel(requestBody: Any, cookie: Cookie): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().post(path = BackendConfig.prefixed("/caselabels"), body = requestBody) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    suspend inline fun <reified T> postUser(requestBody: Any): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().post(path = BackendConfig.prefixed("/users"), body = requestBody)

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    suspend inline fun <reified T> postSession(requestBody: Any): BackendResponse<T> {
        val httpResponse: HttpResponse = rawPostSession(requestBody)

        return BackendResponse(
            statusCode = httpResponse.status,
            body = httpResponse.receive()
        )
    }

    suspend fun rawPostSession(requestBody: Any): HttpResponse {
        return getInstance().post(path = BackendConfig.prefixed("/sessions"), body = requestBody)
    }

    @KtorExperimentalAPI
    suspend fun rawDeleteSession(cookie: Cookie): HttpResponse {
        return getInstance().delete(path = BackendConfig.prefixed("/sessions")) {
            header(HttpHeaders.Cookie, renderSetCookieHeader(cookie))
        }
    }

}

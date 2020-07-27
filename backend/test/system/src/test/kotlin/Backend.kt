import io.ktor.client.HttpClient
import io.ktor.client.call.receive
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.header
import io.ktor.client.request.host
import io.ktor.client.request.port
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode

data class BackendResponse<T>(val statusCode: HttpStatusCode, val body: T)

data class BackendResponseBodyWrapper<T>(val data: T)

data class BackendErrorMessage(val error: String)

object Backend {

    private val client = HttpClient(Apache) {
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }

        expectSuccess = false

        defaultRequest {
            host = Environment.getVariable("HOST", "localhost")
            port = Environment.getVariable("PORT", "3000").toInt()
            header(HttpHeaders.ContentType, ContentType.Application.Json)
        }
    }

    fun getInstance(): HttpClient {
        return client
    }

    suspend inline fun <reified T> postUser(requestBody: Any): BackendResponse<T> {
        val httpResponse: HttpResponse = getInstance().post(path = "/users", body = requestBody)

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
        return getInstance().post(path = "/sessions", body = requestBody)
    }

}

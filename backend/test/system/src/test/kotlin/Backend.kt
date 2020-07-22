import io.ktor.client.HttpClient
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.header
import io.ktor.client.request.host
import io.ktor.client.request.port
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders

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

}

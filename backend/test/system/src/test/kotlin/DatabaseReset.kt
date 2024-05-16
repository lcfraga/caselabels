import io.ktor.client.request.delete
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpStatusCode

object DatabaseReset {

    suspend fun execute() {
        val httpResponse = Backend.getInstance().delete<HttpResponse>(path = BackendConfig.prefixed("/"))

        if (httpResponse.status != HttpStatusCode.OK) {
            throw IllegalStateException("Database reset failed! Please make sure that the backend is running with ENABLE_DESTRUCTIVE_ENDPOINTS=true.")
        }
    }

}

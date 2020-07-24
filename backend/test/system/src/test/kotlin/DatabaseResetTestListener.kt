import io.kotest.core.listeners.TestListener
import io.kotest.core.test.TestCase
import io.ktor.client.request.delete
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpStatusCode

class DatabaseResetTestListener : TestListener {

    private val backend = Backend.getInstance()

    override suspend fun beforeTest(testCase: TestCase) {
        val httpResponse = backend.delete<HttpResponse>()

        if (httpResponse.status != HttpStatusCode.OK) {
            throw IllegalStateException("Database reset failed! Please make sure that the backend is running with ENABLE_DESTRUCTIVE_ENDPOINTS=true.")
        }
    }

}

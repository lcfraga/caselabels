import io.kotest.core.listeners.TestListener
import io.kotest.core.test.TestCase

class DatabaseResetTestListener : TestListener {

    override suspend fun beforeTest(testCase: TestCase) {
       DatabaseReset.execute()
    }

}

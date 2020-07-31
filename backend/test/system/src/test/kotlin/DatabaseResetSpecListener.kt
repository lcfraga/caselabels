import io.kotest.core.listeners.TestListener
import io.kotest.core.spec.Spec

class DatabaseResetSpecListener : TestListener {

    override suspend fun beforeSpec(spec: Spec) {
        DatabaseReset.execute()
    }

}

object Environment {
    fun getVariable(name: String, defaultValue: String): String = System.getenv(name) ?: defaultValue
}

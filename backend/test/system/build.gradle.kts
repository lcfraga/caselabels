plugins {
    kotlin("jvm") version "1.3.72"
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "11"
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

val kotestVersion = "4.1.3"
val ktorVersion = "1.3.1"

dependencies {
    testImplementation(kotlin("stdlib-jdk8"))

    testImplementation("io.ktor:ktor-client-core-jvm:$ktorVersion")
    testImplementation("io.ktor:ktor-client-apache:$ktorVersion")
    testImplementation("io.ktor:ktor-client-jackson:$ktorVersion")

    testImplementation("io.kotest:kotest-assertions-core-jvm:$kotestVersion")
    testImplementation("io.kotest:kotest-property-jvm:$kotestVersion")
    testImplementation("io.kotest:kotest-runner-console-jvm:$kotestVersion")
    testImplementation("io.kotest:kotest-runner-junit5-jvm:$kotestVersion")
}

repositories {
    mavenCentral()
}

plugins {
    id("hu.bme.mit.ase.shingler.gradle.application")
}

application {
    mainClass = "hu.bme.mit.ase.shingler.similarity.SimilarityApp"
}

dependencies {
    implementation(project(":workflow"))

    implementation(libs.slf4j.api)
    implementation(libs.picocli)

    runtimeOnly(libs.slf4j.logback.impl)

    testImplementation(libs.junit.jupiter.core)

    testRuntimeOnly(libs.junit.jupiter.engine)
}

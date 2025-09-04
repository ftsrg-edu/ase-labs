plugins {
    id("hu.bme.mit.ase.shingler.gradle.java")
    application
}

application {
    mainClass = "hu.bme.mit.ase.shingler.similarity.SimilarityApp"
}

dependencies {
    implementation(project(":logic"))

    implementation(libs.picocli)

    runtimeOnly(libs.slf4j.logback.impl)
}

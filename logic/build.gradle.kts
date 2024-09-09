plugins {
    id("hu.bme.mit.ase.shingler.gradle.java")
}

dependencies {
    api(project(":lib"))

    implementation(libs.slf4j.api)

    runtimeOnly(libs.slf4j.log4j.impl)

    testImplementation(libs.junit.jupiter.core)

    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}

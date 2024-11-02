package hu.bme.mit.ase.gradle.conventions

import org.gradle.accessors.dm.LibrariesForLibs
import org.gradle.api.tasks.testing.logging.TestExceptionFormat

plugins {
    `java-library`
    `java-test-fixtures`
    java
}

val libs = the<LibrariesForLibs>()

val mockitoAgent = configurations.create("mockitoAgent")

dependencies {
    testImplementation(libs.junit.jupiter.core)
    testImplementation(libs.junit.jupiter.params)
    testImplementation(libs.mockito.core)

    @Suppress("UnstableApiUsage")
    mockitoAgent(libs.mockito.core) {
        isTransitive = false
    }

    testRuntimeOnly(libs.junit.jupiter.engine)
}

repositories {
    mavenCentral()
}

java.toolchain {
    languageVersion.set(JavaLanguageVersion.of(21))
}

tasks {
    test {
        jvmArgs("-javaagent:${mockitoAgent.asPath}")
        useJUnitPlatform()
        testLogging.showStandardStreams = true
        testLogging.exceptionFormat = TestExceptionFormat.FULL
    }
}

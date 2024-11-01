package hu.bme.mit.ase.gradle.conventions

import org.gradle.accessors.dm.LibrariesForLibs

plugins {
    `java-library`
    `java-test-fixtures`
    java
}

val libs = the<LibrariesForLibs>()

repositories {
    mavenCentral()
}

java.toolchain {
    languageVersion.set(JavaLanguageVersion.of(21))
}

tasks {
    test {
        useJUnitPlatform()
        testLogging.showStandardStreams = true
    }
}

dependencies {
    implementation(libs.slf4j.api)

    runtimeOnly(libs.slf4j.log4j.impl)

    testImplementation(libs.junit.jupiter.core)
    testImplementation(libs.junit.jupiter.params)

    testRuntimeOnly(libs.junit.jupiter.engine)
}

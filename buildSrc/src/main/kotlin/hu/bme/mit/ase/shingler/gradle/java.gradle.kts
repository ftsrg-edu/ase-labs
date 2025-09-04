package hu.bme.mit.ase.shingler.gradle

import org.gradle.accessors.dm.LibrariesForLibs

plugins {
    java
    jacoco
    `java-library`
}

java.toolchain {
    // use JDK version 21
    languageVersion.set(JavaLanguageVersion.of(21))
}

repositories {
    mavenCentral()
}

tasks {
    test {
        useJUnitPlatform()
        testLogging.showStandardStreams = true
        finalizedBy(jacocoTestReport)
    }

    jacocoTestReport {
        inputs.files(test.get().outputs)
    }
}

val libs = the<LibrariesForLibs>()

dependencies {
    testImplementation(libs.junit.jupiter.core)

    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}

// SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
// SPDX-License-Identifier: Apache-2.0

plugins {
    `java-library`
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}

dependencies {
   api(project(":core"))
    api(libs.slf4j.api)

    // enough to set it for just tests
    testRuntimeOnly(libs.slf4j.log4j.impl)

    testImplementation(libs.junit.jupiter.core)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}

tasks.test {
    useJUnitPlatform()
    testLogging.showStandardStreams = true
}

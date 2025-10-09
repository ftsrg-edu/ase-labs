// SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
// SPDX-License-Identifier: Apache-2.0

plugins {
    `java`
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral() 
}


dependencies {
    
    testImplementation(libs.junit.jupiter.core)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}
tasks.test {
    useJUnitPlatform()
    testLogging.showStandardStreams = true
}


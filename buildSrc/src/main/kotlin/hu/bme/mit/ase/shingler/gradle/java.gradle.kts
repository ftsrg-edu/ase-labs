package hu.bme.mit.ase.shingler.gradle

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

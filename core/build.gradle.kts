plugins {
    `java`
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

repositories {
    mavenCentral() // <--- ADD THIS
}


dependencies {
    // Your existing dependencies (if any)
    
    testImplementation(libs.junit.jupiter.core)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}
tasks.test {
    useJUnitPlatform() // <-- very important for JUnit 5
    testLogging.showStandardStreams = true
}


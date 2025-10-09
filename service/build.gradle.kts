plugins {
    `java`
    application
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
    implementation(project(":core"))
    implementation(project(":dictionary"))

    runtimeOnly(libs.slf4j.log4j.impl)

    testImplementation(libs.junit.jupiter.core)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
    
    testImplementation("org.mockito:mockito-core:5.5.0")
    testImplementation("org.mockito:mockito-junit-jupiter:5.5.0")
}



application {
    mainClass.set("hu.bme.mit.ase.passwordchecker.app.Main")
}

tasks.test {
    useJUnitPlatform()
    testLogging.showStandardStreams = true
}

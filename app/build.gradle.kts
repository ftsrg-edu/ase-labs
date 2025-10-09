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
    implementation(project(":service"))

    implementation(libs.jcommander)

    runtimeOnly(libs.slf4j.log4j.impl)


    testImplementation(libs.junit.jupiter.core)
    testRuntimeOnly(libs.junit.jupiter.engine)
    testRuntimeOnly(libs.junit.platform.launcher)
}



application {
    mainClass.set("hu.bme.mit.ase.passwordchecker.app.Main")
}

tasks.test {
    useJUnitPlatform()
    testLogging.showStandardStreams = true
}

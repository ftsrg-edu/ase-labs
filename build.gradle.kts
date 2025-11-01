plugins {
    id("java")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(refinery.generator)
    testImplementation(platform("org.junit:junit-bom:5.12.2"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher:1.13.4")
}

java.toolchain {
    languageVersion.set(JavaLanguageVersion.of(21))
}

tasks.test {
    useJUnitPlatform()
    testLogging.showStandardStreams = true
}

import org.gradle.accessors.dm.LibrariesForLibs

plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

dependencies {
    // https://github.com/gradle/gradle/issues/15383
    implementation(files(libs.javaClass.superclass.protectionDomain.codeSource.location))
    implementation("com.hubspot.jinjava:jinjava:2.8.0")
}

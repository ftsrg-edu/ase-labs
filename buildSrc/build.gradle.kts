import org.gradle.accessors.dm.LibrariesForLibs

plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
    gradlePluginPortal()
}

val libs = the<LibrariesForLibs>()

dependencies {
    // https://github.com/gradle/gradle/issues/15383
    implementation(files(libs.javaClass.superclass.protectionDomain.codeSource.location))
    implementation(libs.python.gradle.plugin)
}

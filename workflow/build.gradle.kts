plugins {
    id("hu.bme.mit.ase.shingler.gradle.java")
}

dependencies {
    api(project(":logic"))

    implementation(libs.slf4j.api)

    runtimeOnly(libs.slf4j.log4j.impl)
}

plugins {
    id("hu.bme.mit.ase.shingler.gradle.java")
}

dependencies {
    api(project(":lib"))
    api(libs.slf4j.api)

    testRuntimeOnly(libs.slf4j.log4j.impl)
}

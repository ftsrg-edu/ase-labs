package hu.bme.mit.ase.shingler.gradle

import org.gradle.kotlin.dsl.application

plugins {
    id("hu.bme.mit.ase.shingler.gradle.java")
    application
}

tasks.distZip {
    enabled = false
}

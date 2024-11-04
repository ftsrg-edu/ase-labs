import com.github.gradle.node.npm.task.NpmTask

plugins {
    base
    alias(libs.plugins.gradle.node)
}

node {
    download.set(true)
    version.set("22.0.0")
}

val npmBuild by tasks.registering(NpmTask::class) {
    dependsOn(tasks.npmInstall)
    inputs.file("package.json")
    inputs.dir("src")
    inputs.dir("test")

    outputs.dirs("out", "syntaxes")

    args = listOf(
        "run",
        "build",
    )
}

tasks.build {
    dependsOn(npmBuild)
}

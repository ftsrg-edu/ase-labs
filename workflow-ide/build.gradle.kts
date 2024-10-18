import com.github.gradle.node.npm.task.NpmTask

plugins {
    id("com.github.node-gradle.node") version "7.1.0"
}

node {
    download.set(true)
    version.set("22.0.0")
}

val cliOutput by configurations.creating {
    isCanBeConsumed = true
}

val npmCI by tasks.registering(NpmTask::class) {
    inputs.file("package-lock.json")
    outputs.dir("node_modules")

    args = listOf(
        "ci",
    )
}

val npmBuild by tasks.registering(NpmTask::class) {
    inputs.dir("src")
    inputs.file("esbuild.js")
    inputs.file("package.json")
    inputs.files(npmCI.get().outputs)
    outputs.dir("dist")

    args = listOf(
        "run",
        "package",
    )
}

//val collectCliOutput by tasks.registering(Sync::class) {
//    from("dist")
//    into("build/cli")
//}

artifacts {
    add(cliOutput.name, npmBuild)
}

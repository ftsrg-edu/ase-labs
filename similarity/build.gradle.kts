import com.github.gradle.node.task.NodeTask
import com.pswidersk.gradle.python.VenvTask

plugins {
    id("hu.bme.mit.ase.shingler.gradle.application")
    id("com.pswidersk.python-plugin") version "2.7.2"
    id("com.github.node-gradle.node") version "7.1.0"
}

node {
    download.set(true)
    version.set("22.0.0")
}

application {
    mainClass = "hu.bme.mit.ase.shingler.similarity.SimilarityApp"
}

val cliOutput by configurations.creating {
    isCanBeResolved = true
}

dependencies {
    cliOutput(project(":workflow-ide", configuration = cliOutput.name))
}

val srcGenJava = "src/gen/java"

sourceSets.main {
    java.srcDir(srcGenJava)
}

dependencies {
    implementation(project(":workflow"))

    implementation(libs.slf4j.api)
    implementation(libs.picocli)

    runtimeOnly(libs.slf4j.logback.impl)

    testImplementation(libs.junit.jupiter.core)
    testImplementation(libs.junit.jupiter.params)

    testRuntimeOnly(libs.junit.jupiter.engine)
}

val cloneCliOutput by tasks.registering(Sync::class) {
    inputs.files(cliOutput)

    from(cliOutput.files)
    into("build/cli")
}

val generateDomainModel by tasks.registering(NodeTask::class) {
    inputs.files(cloneCliOutput.get().outputs)
    inputs.file("model.wfl")
    outputs.file("model.json")

    script.set(File("build/cli/main.js"))

    args = listOf(
        "generate",
        "model.wfl",
    )
}

val installPythonPackages by tasks.registering(VenvTask::class) {
    venvExec = "pip3"

    args = listOf(
        "install",
        "jinja2",
    )
}

val generateSimilarityWorkflow by tasks.registering(VenvTask::class) {
    dependsOn(installPythonPackages)
    inputs.files(generateDomainModel.get().outputs)

    inputs.files(
        "src/main/python/generate.py",
        "src/main/jinja/workflow.java.j2",
        "model.json",
    )

    args = listOf(
        "src/main/python/generate.py",
        "model.json",
        "src/main/jinja/workflow.java.j2",
        "$srcGenJava/hu/bme/mit/ase/shingler/similarity/SimilarityWorkflow.java",
    )

    outputs.dir(srcGenJava)
}

tasks.compileJava {
    inputs.files(generateSimilarityWorkflow.get().outputs)
}

tasks.clean {
    delete(srcGenJava)
}

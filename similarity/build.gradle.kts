import com.github.gradle.node.task.NodeTask
import hu.bme.mit.ase.shingler.gradle.GenerateShinglerFromJinja

plugins {
    id("hu.bme.mit.ase.shingler.gradle.application")
    id("com.github.node-gradle.node") version "7.1.0"
}

node {
    download.set(true)
    version.set("22.0.0")
}

application {
    mainClass = "hu.bme.mit.ase.shingler.similarity.SimilarityApp"
}

val langiumCliOutput by configurations.creating {
    isCanBeResolved = true
}

dependencies {
    langiumCliOutput(project(":workflow-ide", configuration = langiumCliOutput.name))
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
    inputs.files(langiumCliOutput)

    from(langiumCliOutput.files)
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

val generateSimilarityWorkflow by tasks.registering(GenerateShinglerFromJinja::class) {
    inputs.files(generateDomainModel.get().outputs)

    modelFile.set(File("model.json"))
    templateFile.set(File("src/main/jinja/workflow.java.j2"))
    outputFile.set(File("$srcGenJava/hu/bme/mit/ase/shingler/similarity/SimilarityWorkflow.java"))
}

tasks.compileJava {
    inputs.files(generateSimilarityWorkflow.get().outputs)
}

tasks.clean {
    delete(srcGenJava)
}

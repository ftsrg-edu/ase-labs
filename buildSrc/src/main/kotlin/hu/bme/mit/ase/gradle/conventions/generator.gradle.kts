package hu.bme.mit.ase.gradle.conventions

import com.pswidersk.gradle.python.VenvTask
import org.gradle.api.tasks.Sync
import org.gradle.kotlin.dsl.getValue
import org.gradle.kotlin.dsl.provideDelegate
import org.gradle.kotlin.dsl.registering

plugins {
    id("hu.bme.mit.ase.gradle.conventions.jvm")
    id("com.pswidersk.python-plugin")
}

pythonPlugin {
    useHomeDir = true
}

val srcGenJava = "src/gen/java"

sourceSets.main {
    java.srcDir(srcGenJava)
}

val installPythonPackages by tasks.registering(VenvTask::class) {
    venvExec = "pip3"

    args = listOf(
        "install",
        "jinja2",
    )
}

val syncGeneratorScripts by tasks.registering(Sync::class) {
    from(rootProject.layout.projectDirectory.dir("python-scripts"))
    into(project.layout.buildDirectory.dir("python-scripts"))
}

val syncModels by tasks.registering(Sync::class) {
    from(rootProject.layout.projectDirectory.dir("models"))
    into(project.layout.buildDirectory.dir("models"))
}

val syncTemplates by tasks.registering(Sync::class) {
    from(rootProject.layout.projectDirectory.dir("jinja-templates"))
    into(project.layout.buildDirectory.dir("jinja-templates"))
}

val generate by tasks.registering(VenvTask::class) {
    inputs.files(syncGeneratorScripts.get().outputs)
    inputs.files(syncModels.get().outputs)
    inputs.files(syncTemplates.get().outputs)

    dependsOn(installPythonPackages)

    outputs.dir(srcGenJava)
}

tasks.compileJava {
    inputs.files(generate.get().outputs)
}

tasks.clean {
    delete(srcGenJava)
}

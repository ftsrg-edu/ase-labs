import hu.bme.mit.ase.gradle.conventions.GenerateFilesTask

plugins {
    id("hu.bme.mit.ase.gradle.conventions.jvm")
}

sourceSets.main {
    java.srcDir("src/gen/java")
}

tasks.clean {
    delete("src/gen/java")
}

dependencies {
    implementation(project(":computer-types"))
    implementation(project(":software-repository"))
}

val generate by tasks.registering(GenerateFilesTask::class) {
    listKey.set("deployments")
    modelFile = rootProject.layout.projectDirectory.dir("models").file("deployments.json")
    templateFile = rootProject.layout.projectDirectory.dir("jinja-templates").file("deployment.java.j2")
    outputDirectory = project.layout.projectDirectory.dir("src/gen/java/hu/bme/mit/ase/cps/cps/deployments")
}

tasks.compileJava {
    dependsOn(generate)
}

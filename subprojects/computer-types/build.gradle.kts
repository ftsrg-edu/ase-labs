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

val generate by tasks.registering(GenerateFilesTask::class) {
    listKey.set("computer_types")
    modelFile = rootProject.layout.projectDirectory.dir("models").file("computer-types.json")
    templateFile = rootProject.layout.projectDirectory.dir("jinja-templates").file("computer-type.java.j2")
    outputDirectory = project.layout.projectDirectory.dir("src/gen/java/hu/bme/mit/ase/cps/types/computers")
}

tasks.compileJava {
    dependsOn(generate)
}

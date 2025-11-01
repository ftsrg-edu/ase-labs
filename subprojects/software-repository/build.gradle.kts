import hu.bme.mit.ase.gradle.conventions.GenerateFileTask

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
    api(project(":software-types"))
}

val generate by tasks.creating(GenerateFileTask::class) {
    modelFile = rootProject.layout.projectDirectory.dir("models").file("software-types.json")
    templateFile = rootProject.layout.projectDirectory.dir("jinja-templates").file("software-repository.java.j2")
    outputFile = project.layout.projectDirectory.file("src/gen/java/hu/bme/mit/ase/cps/types/software/SoftwareRepository.java")
}

tasks.compileJava {
    dependsOn(generate)
}

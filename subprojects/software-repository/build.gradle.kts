import com.pswidersk.gradle.python.VenvTask

plugins {
    id("hu.bme.mit.ase.gradle.conventions.generator")
}

dependencies {
    api(project(":software-types"))
}

val generate by tasks.getting(VenvTask::class) {
    args = listOf(
        "build/python-scripts/generate-software-repository.py",
        "build/models/software-types.json",
        "build/jinja-templates/software-repository.java.j2",
        "src/gen/java/hu/bme/mit/ase/cps/types/software/SoftwareRepository.java",
    )
}

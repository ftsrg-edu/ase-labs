import com.pswidersk.gradle.python.VenvTask

plugins {
    id("hu.bme.mit.ase.gradle.conventions.generator")
}

val generate by tasks.getting(VenvTask::class) {
    args = listOf(
        "build/python-scripts/generate-software-types.py",
        "build/models/software-types.json",
        "build/jinja-templates/software-type.java.j2",
        "src/gen/java/hu/bme/mit/ase/cps/types/software",
    )
}

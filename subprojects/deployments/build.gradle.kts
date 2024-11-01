import com.pswidersk.gradle.python.VenvTask

plugins {
    id("hu.bme.mit.ase.gradle.conventions.generator")
}

dependencies {
    implementation(project(":computer-types"))
    implementation(project(":software-repository"))
}

val generate by tasks.getting(VenvTask::class) {
    args = listOf(
        "build/python-scripts/generate-deployments.py",
        "build/models/deployments.json",
        "build/jinja-templates/deployment.java.j2",
        "src/gen/java/hu/bme/mit/ase/cps/deployments",
    )
}

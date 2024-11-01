rootProject.name = "ASE Homework 3"

val homeworkStage: String by settings
val stage = homeworkStage.toInt()

if (stage >= 1) {
    include(
        "computer-types",
    )
}

if (stage >= 2) {
    include(
        "software-types",
    )
}

if (stage >= 3) {
    include(
        "software-repository",
    )
}

if (stage >= 4) {
    include(
        "deployments",
    )
}

rootProject.children.forEach { project ->
    project.projectDir = file("subprojects/${project.name}")
}

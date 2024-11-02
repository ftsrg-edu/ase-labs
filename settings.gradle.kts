rootProject.name = "ASE Homework 3"

val homeworkTask: String by settings
val task = homeworkTask.toInt()

if (task >= 1) {
    include(
        "computer-types",
    )
}

if (task >= 2) {
    include(
        "software-types",
    )
}

if (task >= 3) {
    include(
        "software-repository",
    )
}

if (task >= 4) {
    include(
        "deployments",
    )
}

rootProject.children.forEach { project ->
    project.projectDir = file("subprojects/${project.name}")
}

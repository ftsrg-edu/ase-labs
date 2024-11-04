plugins {
    id("me.champeau.jmh") version "0.7.2"
}

repositories {
    mavenCentral()
}

dependencies {
    jmh(project(":logic"))
}

jmh {
    warmupIterations = 2
    iterations = 2
    fork = 2
}
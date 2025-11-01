package hu.bme.mit.ase.gradle.conventions

import com.fasterxml.jackson.databind.ObjectMapper
import com.hubspot.jinjava.Jinjava
import org.gradle.api.DefaultTask
import org.gradle.api.provider.Property
import org.gradle.api.tasks.Input
import org.gradle.api.tasks.InputFile
import org.gradle.api.tasks.OutputDirectory
import org.gradle.api.tasks.OutputFile
import org.gradle.api.tasks.TaskAction

abstract class GenerateFileTask : DefaultTask() {

    @get:InputFile
    val modelFile = project.objects.fileProperty()

    @get:InputFile
    val templateFile = project.objects.fileProperty()

    @get:OutputFile
    val outputFile = project.objects.fileProperty()

    @TaskAction
    fun action() {
        val modelString = modelFile.get().asFile.readText()
        val templateString = templateFile.get().asFile.readText()

        val mapper = ObjectMapper()
        val context = mapper.readValue(modelString, Map::class.java) as Map<String, Any>
        val jinjava = Jinjava()
        val renderedTemplate = jinjava.render(templateString, context)

        val output = outputFile.get().asFile
        output.parentFile.mkdirs()
        output.createNewFile()
        output.writeText(renderedTemplate)
    }

}

abstract class GenerateFilesTask : DefaultTask() {

    @get:Input
    abstract val listKey: Property<String>

    @get:InputFile
    val modelFile = project.objects.fileProperty()

    @get:InputFile
    val templateFile = project.objects.fileProperty()

    @get:OutputDirectory
    val outputDirectory = project.objects.directoryProperty()

    @TaskAction
    fun action() {
        val modelString = modelFile.get().asFile.readText()
        val templateString = templateFile.get().asFile.readText()

        val mapper = ObjectMapper()
        val context = mapper.readValue(modelString, Map::class.java) as Map<String, Any>
        val jinjava = Jinjava()

        outputDirectory.get().asFile.deleteRecursively()
        outputDirectory.get().asFile.mkdirs()

        val elements = context[listKey.get()] as Collection<Map<String, Any>>

        for (element in elements) {
            generateFile(jinjava, templateString, element)
        }
    }

    fun generateFile(jinjava: Jinjava, templateString: String, context: Map<String, Any>) {
        val renderedTemplate = jinjava.render(templateString, context)

        val fileName = context["name"]
        val output = outputDirectory.get().asFile.resolve("$fileName.java")
        output.createNewFile()
        output.writeText(renderedTemplate)
    }

}

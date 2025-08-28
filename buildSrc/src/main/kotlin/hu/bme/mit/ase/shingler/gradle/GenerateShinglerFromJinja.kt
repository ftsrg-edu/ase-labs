package hu.bme.mit.ase.shingler.gradle

import com.fasterxml.jackson.databind.ObjectMapper
import com.hubspot.jinjava.Jinjava
import org.gradle.api.DefaultTask
import org.gradle.api.tasks.InputFile
import org.gradle.api.tasks.OutputFile
import org.gradle.api.tasks.TaskAction

abstract class GenerateShinglerFromJinja : DefaultTask() {

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
        output.createNewFile()
        output.writeText(renderedTemplate)
    }

}

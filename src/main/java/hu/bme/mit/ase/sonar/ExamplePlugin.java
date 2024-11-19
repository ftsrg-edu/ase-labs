package hu.bme.mit.ase.sonar;

import org.sonar.api.Plugin;

public class ExamplePlugin implements Plugin {
    @Override
    public void define(Context context) {
        // server extensions -> objects are instantiated during server startup
        context.addExtension(ExampleRulesDefinition.class);

        // batch extensions -> objects are instantiated during code analysis
        context.addExtension(ExampleCheckRegistrar.class);
    }
}

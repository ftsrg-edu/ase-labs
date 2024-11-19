package hu.bme.mit.ase.sonar;

import org.junit.jupiter.api.Test;
import org.sonar.java.checks.verifier.CheckVerifier;

import java.io.File;
import java.util.Arrays;

class ScalarProductWithSelfRuleTest {
    @Test
    void test() {
        CheckVerifier.newVerifier()
                .withClassPath(Arrays.asList(new File("src/test/files/lib.jar"),
                        new File("src/test/files/logic.jar")))
                .onFile("src/test/files/Example.java")
                .withCheck(new ScalarProductWithSelfRule())
                .verifyIssues();
    }
}

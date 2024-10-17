package ase.hw1.tests;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import tools.refinery.generator.ModelSemantics;
import tools.refinery.generator.standalone.StandaloneRefinery;
import tools.refinery.language.model.problem.Problem;
import tools.refinery.logic.term.truthvalue.TruthValue;
import tools.refinery.store.reasoning.representation.PartialSymbol;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

import static ase.hw1.tests.RefineryFileTests.*;
import static org.junit.jupiter.api.Assertions.*;

class MetamodelTests {
    private InputStream getResourceAsStream() {
        return getClass().getClassLoader().getResourceAsStream("hw1.problem");
    }

    private String getSolution() {
        InputStream resourceAsStream = getResourceAsStream();
        assertNotNull(resourceAsStream);
        List<String> lines = toLines(resourceAsStream);
        int linePosition = linePosition(lines);
        assertNotEquals(-1, linePosition);
        String solution = concatFirstLines(lines, linePosition);
        assertNotEquals(0, solution.length());
        return solution;
    }

    private String getStage(String fileName) {
        InputStream resourceAsStream = getClass().getClassLoader().getResourceAsStream(fileName);
        List<String> lines = toLines(resourceAsStream);
        return String.join("\n",lines);
    }

    private String getStages(String... fileNames) {
        String solution = getSolution();
        List<String> listOfStages = Arrays.stream(fileNames).map(this::getStage).toList();
        return solution + "\n" + String.join("\n",listOfStages);
    }

    private void testConsistency(String problem) {
        Problem parsedProblem = null;
        try {
            parsedProblem = StandaloneRefinery.getProblemLoader().loadString(problem);
        } catch (IOException e) {
            fail("Failed to load the problem");
        }
        assertNotNull(parsedProblem);
        ModelSemantics semantics = StandaloneRefinery.getSemanticsFactory().tryCreateSemantics(parsedProblem);

        for (var anyPartialRelation : semantics.getProblemTrace().getRelationTrace().values()) {
            System.out.println(anyPartialRelation);
            if (anyPartialRelation instanceof PartialSymbol<TruthValue, Boolean> truthSymbol) {
                var cursor = semantics.getPartialInterpretation(truthSymbol).getAll();
                while (cursor.move()) {
                    if (cursor.getValue() == TruthValue.ERROR) {
                        Assertions.fail("Error in model, this symbol " + anyPartialRelation.name() +
                                " has error at" + cursor.getKey());
                    }
                }
            }
        }
    }

    @Test
    void testStage0() {
        testConsistency(getSolution());
    }

    @Test
    void testStage1() {
        testConsistency(getStages("stage1.problem"));
    }

    @Test
    void testStage2() {
        testConsistency(getStages(
                "stage1.problem","stage2.problem"));
    }

    @Test
    void testStage3() {
        testConsistency(getStages(
                "stage1.problem","stage2.problem","stage3.problem"));
    }

    @Test
    void testStage4() {
        testConsistency(getStages(
                "stage1.problem","stage2.problem","stage3.problem","stage4.problem"));
    }

    @Test
    void testStage5() {
        testConsistency(getStages(
                "stage1.problem","stage2.problem","stage3.problem","stage4.problem","stage5.problem"));
    }
}

package hu.bme.mit.ase.shingler.diversity;

import hu.bme.mit.ase.shingler.lib.DocumentDiversityComputor;
import hu.bme.mit.ase.shingler.logic.BaseDiversityListComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class DiversityTest {

    protected void testDiversity(String document, boolean wordGranularity, Integer ... expected) {
        DocumentDiversityComputor documentDiversityComputor = new SimpleDocumentDiversityComputor(
                new BaseTokenizer(),
                new BaseDiversityListComputor()
        );
        var result = documentDiversityComputor.computeDiversity(document, wordGranularity);
        Assertions.assertArrayEquals(expected, result.toArray());
    }

    @Test
    public void singleCharacterTest() {
        testDiversity("a", false, 1);
    }

    @Test
    public void singleWordTest() {
        testDiversity("a", true, 1);
    }

    @Test
    public void simpleTest() {
        testDiversity("This ball here is better", false, 4, 3, 3, 2, 4);
    }

    @Test
    public void simpleWordTest() {
        testDiversity("This ball here is better", true, 5);
    }

    @Test
    public void sameCharactersShouldBeEqual() {
        testDiversity("aa aaa a aaaaa", false, 1, 1, 1, 1);
    }

    @Test
    public void differentCharactersShouldNotBeEqual() {
        testDiversity("ab abc a abcdef", false, 2, 3, 1, 6);
    }

    @Test
    public void differentWordsShouldNotBeEqual() {
        testDiversity("ab abc a abcdef", true, 4);
    }

}

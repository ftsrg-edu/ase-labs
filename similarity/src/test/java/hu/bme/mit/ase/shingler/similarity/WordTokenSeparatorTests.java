package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class WordTokenSeparatorTests extends TestBase {

    private static final double splittedToTwoSentence = 2.0 / Math.sqrt(2.0 * 3.0);

    @Test
    public void numberSeparatesNot() {
        testSimilarity(0.0,
                "abc d",
                "abc9d",
                2, true);
    }

    @Test
    public void capitalLetterSeparatesNot() {
        testSimilarity(0.0,
                "abc d",
                "abcEd",
                2, true);
    }

    @Test
    public void spaceSeparates() {
        testSimilarity(0.0,
                "abc d",
                "abcd",
                2, true);
    }

    @Test
    public void fullStopSeparates() {
        testSimilarity(splittedToTwoSentence,
                "abc.d",
                "abc d",
                2, true);
    }

    @Test
    public void semicolonSeparates() {
        testSimilarity(1.0,
                "abc;d",
                "abc d",
                2, true);
    }

    @Test
    public void exclamationSeparates() {
        testSimilarity(splittedToTwoSentence,
                "abc!d",
                "abc d",
                2, true);
    }

    @Test
    public void questionSeparates() {
        testSimilarity(splittedToTwoSentence,
                "abc?d",
                "abc d",
                2, true);
    }

    @Test
    public void commaSeparates() {
        testSimilarity(1.0,
                "abc,d",
                "abc d",
                2, true);
    }

    @Test
    public void colonSeparates() {
        testSimilarity(1.0,
                "abc:d",
                "abc d",
                2, true);
    }

    @Test
    public void dashSeparates() {
        testSimilarity(1.0,
                "abc-d",
                "abc d",
                2, true);
    }

    @Test
    public void parenthesisSeparates() {
        testSimilarity(1.0,
                "abc(d",
                "abc d",
                2, true);
    }
}

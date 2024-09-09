package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class SingleBlockTests extends TestBase {

    @Test
    public void allDifferentChars() {
        testSimilarity(0.0,
                "abcdefgh",
                "ijklm",
                3, false);
    }

    @Test
    public void allDifferentWords() {
        testSimilarity(0.0,
                "aa bb cc dd ee ff gg hh",
                "ii jj kk ll mm",
                3, true);
    }

    @Test
    public void sameStringChars() {
        testSimilarity(1.0,
                "abcdefgh",
                "abcdefgh",
                3, false);
    }

    @Test
    public void sameStringWords() {
        testSimilarity(1.0,
                "aa bb cc dd ee ff gg hh",
                "aa bb cc dd ee ff gg hh",
                3, true);
    }

    @Test
    public void caseDifferenceChars() {
        testSimilarity(1.0,
                "aBcDeFGh",
                "abcdefgh",
                3, false);
    }

    @Test
    public void caseDifferenceWords() {
        testSimilarity(1.0,
                "aa BB cc DD ee FF GG hh",
                "aa bb cc dd ee ff gg hh",
                3, true);
    }

    @Test
    public void partialOverlap3Chars() {
        testSimilarity(2.0 / 5.0,
                "abc",
                "abd",
                3, false);
    }

    @Test
    public void partialOverlap3Words() {
        testSimilarity(2.0 / 5.0,
                "aa bb cc",
                "aa bb dd",
                3, true);
    }

    @Test
    public void partialOverlap2Chars() {
        testSimilarity(2.0 / 4.0,
                "abc",
                "abd",
                2, false);
    }

    @Test
    public void partialOverlap2Words() {
        testSimilarity(2.0 / 4.0,
                "aa bb cc",
                "aa bb dd",
                2, true);
    }

    @Test
    public void headTail2Chars() {
        testSimilarity(2.0 / 5.0,
                "abcd",
                "bcxa",
                2, false);
    }

    @Test
    public void headTail2Words() {
        testSimilarity(2.0 / 5.0,
                "aa bb cc dd",
                "bb cc xx aa",
                2, true);
    }

    @Test
    public void numbersAndCapitals2Chars() {
        testSimilarity(2.0 / 5.0,
                "1B3d",
                "B3x1",
                2, false);
    }

    @Test
    public void numbersAndCapitals2Words() {
        testSimilarity(2.0 / 5.0,
                "11 BB 33 dd",
                "BB 33 xx 11",
                2, true);
    }

    @Test
    public void shortBlock3Chars() {
        testSimilarity(3.0 / Math.sqrt(3 * 5),
                "abb",
                "ab",
                3, false);
    }

    @Test
    public void shortBlock3Words() {
        testSimilarity(3.0 / Math.sqrt(3 * 5),
                "aa bb bb",
                "aa bb",
                3, true);
    }

    @Test
    public void multiOccurrenceShingles2Chars() {
        testSimilarity(11.0 / Math.sqrt(10 * 19),
                "baaab", // b -> 2, aa -> 2, ab -> 1, ba -> 1
                "aaaaab",  // a -> 1, aa -> 4, ab -> 1, b -> 1
                2, false);
    }

    @Test
    public void multiOccurrenceShingles2Words() {
        testSimilarity(11.0 / Math.sqrt(10 * 19),
                "b1 a1 a1 a1 b1", // b -> 2, aa -> 2, ab -> 1, ba -> 1
                "a1 a1 a1 a1 a1 b1",  // a -> 1, aa -> 4, ab -> 1, b -> 1
                2, true);
    }

}




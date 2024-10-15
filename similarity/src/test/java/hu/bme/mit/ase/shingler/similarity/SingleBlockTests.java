package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class SingleBlockTests extends TestBase {

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void allDifferentChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,0.0,
                "abcdefgh",
                "ijklm",
                3, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void allDifferentWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,0.0,
                "aa bb cc dd ee ff gg hh",
                "ii jj kk ll mm",
                3, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void sameStringChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abcdefgh",
                "abcdefgh",
                3, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void sameStringWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "aa bb cc dd ee ff gg hh",
                "aa bb cc dd ee ff gg hh",
                3, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void caseDifferenceChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "aBcDeFGh",
                "abcdefgh",
                3, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void caseDifferenceWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "aa BB cc DD ee FF GG hh",
                "aa bb cc dd ee ff gg hh",
                3, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void partialOverlap3Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "abc",
                "abd",
                3, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void partialOverlap3Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "aa bb cc",
                "aa bb dd",
                3, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void partialOverlap2Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 4.0,
                "abc",
                "abd",
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void partialOverlap2Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 4.0,
                "aa bb cc",
                "aa bb dd",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void headTail2Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "abcd",
                "bcxa",
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void headTail2Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "aa bb cc dd",
                "bb cc xx aa",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void numbersAndCapitals2Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "1B3d",
                "B3x1",
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void numbersAndCapitals2Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,2.0 / 5.0,
                "11 BB 33 dd",
                "BB 33 xx 11",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void shortBlock3Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,3.0 / Math.sqrt(3 * 5),
                "abb",
                "ab",
                3, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void shortBlock3Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,3.0 / Math.sqrt(3 * 5),
                "aa bb bb",
                "aa bb",
                3, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void multiOccurrenceShingles2Chars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,11.0 / Math.sqrt(10 * 19),
                "baaab", // b -> 2, aa -> 2, ab -> 1, ba -> 1
                "aaaaab",  // a -> 1, aa -> 4, ab -> 1, b -> 1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void multiOccurrenceShingles2Words(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,11.0 / Math.sqrt(10 * 19),
                "b1 a1 a1 a1 b1", // b -> 2, aa -> 2, ab -> 1, ba -> 1
                "a1 a1 a1 a1 a1 b1",  // a -> 1, aa -> 4, ab -> 1, b -> 1
                2, true);
    }

}




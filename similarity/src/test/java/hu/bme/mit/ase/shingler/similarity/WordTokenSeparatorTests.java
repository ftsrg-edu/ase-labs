package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class WordTokenSeparatorTests extends TestBase {

    private static final double splittedToTwoSentence = 2.0 / Math.sqrt(2.0 * 3.0);

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void numberSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,0.0,
                "abc d",
                "abc9d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void capitalLetterSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,0.0,
                "abc d",
                "abcEd",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void spaceSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,0.0,
                "abc d",
                "abcd",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void fullStopSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,splittedToTwoSentence,
                "abc.d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void semicolonSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abc;d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void exclamationSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,splittedToTwoSentence,
                "abc!d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void questionSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,splittedToTwoSentence,
                "abc?d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void commaSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abc,d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void colonSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abc:d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void dashSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abc-d",
                "abc d",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void parenthesisSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abc(d",
                "abc d",
                2, true);
    }
}

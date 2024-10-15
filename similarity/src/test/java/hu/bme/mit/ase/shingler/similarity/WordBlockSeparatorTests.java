package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class WordBlockSeparatorTests extends TestBase {

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void spaceSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void fullStopSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc.d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void semicolonSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc;d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void exclamationSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc!d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void questionSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc?d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void commaSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc,d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void colonSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc:d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void dashSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc-d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void parenthesisSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc(d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }
}

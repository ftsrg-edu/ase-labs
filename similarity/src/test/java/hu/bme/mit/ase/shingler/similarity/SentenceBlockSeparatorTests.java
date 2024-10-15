package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class SentenceBlockSeparatorTests extends TestBase {

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void fullStopSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void semicolonSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1; d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void exclamationSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "a1 b1 c1! d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void questionSeparates(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "a1 b1 c1? d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void commaSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1,d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void colonSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1:d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void dashSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1-d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void parenthesisSeparatesNot(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1(d1",
                "a1 b1 c1 d1",
                2, true);
    }

}

package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class BlockBoundaryTests extends TestBase {

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void duplicatedBlockChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator, 1.0,
                "abcdefgh abcdefgh",
                "abcdefgh",
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void duplicatedBlockWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1 d1 e1 f1 g1 h1. a1 b1 c1 d1 e1 f1 g1 h1",
                "a1 b1 c1 d1 e1 f1 g1 h1",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockOrderIndependentChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "abcdefgh ijklm",
                "ijklm abcdefgh",
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockOrderIndependentWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,1.0,
                "a1 b1 c1 d1 e1 f1 g1 h1. i1 j1 k1 l1 m1",
                "i1 j1 k1 l1 m1. a1 b1 c1 d1 e1 f1 g1 h1",
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockBoundaryPresenceMattersChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockBoundaryPresenceMattersWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / 5.0,
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockBoundaryPositionMattersChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / Math.sqrt(6 * 5),
                "ab cd", // a->1, ab->1, b->1, c->1, cd->1, d->1
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockBoundaryPositionMattersWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,4.0 / Math.sqrt(6 * 5),
                "a1 b1. c1 d1", // a->1, ab->1, b->1, c->1, cd->1, d->1
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                2, true);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockHeadsTailsChars(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,7.0 / Math.sqrt(11 * 9),
                "abc ab", // a->2, ab->2, bc->1, c->1, b->1
                "ab cdb", // a->1, ab->1, b->2, c->1, cd->1, db->1
                2, false);
    }

    @ParameterizedTest
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void blockHeadsTailsWords(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,7.0 / Math.sqrt(11 * 9),
                "a1 b1 c1. a1 b1", // a1->2, b1->2, c1->1
                "a1 b1. c1 d1 b1", // a1->1, b1->2, c1->1, d1->1
                2, true);
    }

}

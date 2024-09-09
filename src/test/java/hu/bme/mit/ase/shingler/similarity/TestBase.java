package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import hu.bme.mit.ase.shingler.logic.BaseCosineSimilarityComputor;
import hu.bme.mit.ase.shingler.logic.BaseOccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;
import org.junit.jupiter.api.Assertions;

public class TestBase {

    private static final double TOLERANCE_EPSILON = 1.0E-5;

    protected DocumentSimilarityEstimator getSingleThreaded() {
        return new SingleThreadedDocumentSimilarityEstimator(
                new BaseTokenizer(),
                new BaseOccurrenceVectorComputor(),
                new BaseVectorMultiplier(),
                new BaseCosineSimilarityComputor()
        );
    }

    protected DocumentSimilarityEstimator getMultiThreaded() {
        return new MultiThreadedDocumentSimilarityEstimator(
                new BaseTokenizer(),
                new BaseOccurrenceVectorComputor(),
                new BaseVectorMultiplier(),
                new BaseCosineSimilarityComputor()
        );
    }

    protected void assertWithTolerance(double expected, double actual) {
        Assertions.assertEquals(expected, actual, TOLERANCE_EPSILON);
    }

    protected void testSimilarity(double expected, String document1, String document2, int shingleSize, boolean wordGranularity) {
        var singleResult = getSingleThreaded().computeSimilarity(document1, document2, shingleSize, wordGranularity);
        assertWithTolerance(expected, singleResult);

        var multiResult = getMultiThreaded().computeSimilarity(document1, document2, shingleSize, wordGranularity);
        assertWithTolerance(expected, multiResult);
    }

}

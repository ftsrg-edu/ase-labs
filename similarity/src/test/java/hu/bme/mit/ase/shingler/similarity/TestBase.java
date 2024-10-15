package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.api.Assertions;

public class TestBase {

    private static final double TOLERANCE_EPSILON = 1.0E-5;

    protected void assertWithTolerance(double expected, double actual) {
        Assertions.assertEquals(expected, actual, TOLERANCE_EPSILON);
    }

    protected void testSimilarity(DocumentSimilarityEstimator estimator, double expected, String document1, String document2, int shingleSize, boolean wordGranularity) {
        var result = estimator.computeSimilarity(document1, document2, shingleSize, wordGranularity);
        assertWithTolerance(expected, result);
    }

}

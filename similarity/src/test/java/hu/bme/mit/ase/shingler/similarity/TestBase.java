package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import hu.bme.mit.ase.shingler.logic.BaseCosineSimilarityComputor;
import hu.bme.mit.ase.shingler.logic.BaseOccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;
import org.junit.jupiter.api.Assertions;

import java.util.List;

public class TestBase {

    private static final double TOLERANCE_EPSILON = 1.0E-5;

    private List<DocumentSimilarityEstimator> getEstimators() {
        return List.of(
                new SingleThreadedDocumentSimilarityEstimator(
                        new BaseTokenizer(),
                        new BaseOccurrenceVectorComputor(),
                        new BaseVectorMultiplier(),
                        new BaseCosineSimilarityComputor()
                ),
                new MultiThreadedDocumentSimilarityEstimator(
                        new BaseTokenizer(),
                        new BaseOccurrenceVectorComputor(),
                        new BaseVectorMultiplier(),
                        new BaseCosineSimilarityComputor()
                ),
                new WorkflowDocumentSimilarityEstimator()
        );
    }

    protected void assertWithTolerance(double expected, double actual) {
        Assertions.assertEquals(expected, actual, TOLERANCE_EPSILON);
    }

    protected void testSimilarity(double expected, String document1, String document2, int shingleSize, boolean wordGranularity) {
        for (var estimator : getEstimators()) {
            var result = estimator.computeSimilarity(document1, document2, shingleSize, wordGranularity);
            assertWithTolerance(expected, result);
        }
    }

}

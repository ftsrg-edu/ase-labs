package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ArgumentsSource;

public class SimpleTests extends TestBase {

    @ParameterizedTest(name = "{0}")
    @ArgumentsSource(SimilarityEstimatorArgumentsProvider.class)
    public void fruitTest(DocumentSimilarityEstimator similarityEstimator) {
        testSimilarity(similarityEstimator,9.0 / 11.0,
                "Banana",
                "Ananas",
                2, false);

        testSimilarity(similarityEstimator,9.0 / 11.0,
                "Banana",
                "Ananas",
                2, false);
    }

}

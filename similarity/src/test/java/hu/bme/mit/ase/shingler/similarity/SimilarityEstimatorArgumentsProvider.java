package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.logic.BaseCosineSimilarityComputor;
import hu.bme.mit.ase.shingler.logic.BaseOccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import hu.bme.mit.ase.shingler.logic.BaseVectorMultiplier;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.ArgumentsProvider;

import java.util.stream.Stream;

public class SimilarityEstimatorArgumentsProvider implements ArgumentsProvider {
    
    @Override
    public Stream<? extends Arguments> provideArguments(ExtensionContext context) {
        return Stream.of(
                Arguments.of(
                        new SingleThreadedDocumentSimilarityEstimator(
                                new BaseTokenizer(),
                                new BaseOccurrenceVectorComputor(),
                                new BaseVectorMultiplier(),
                                new BaseCosineSimilarityComputor()
                        )
                ),
                Arguments.of(
                        new MultiThreadedDocumentSimilarityEstimator(
                                new BaseTokenizer(),
                                new BaseOccurrenceVectorComputor(),
                                new BaseVectorMultiplier(),
                                new BaseCosineSimilarityComputor()
                        )
                ),
                Arguments.of(new WorkflowDocumentSimilarityEstimator())
        );
    }
    
}

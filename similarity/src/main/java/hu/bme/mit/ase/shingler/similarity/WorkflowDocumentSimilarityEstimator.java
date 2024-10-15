package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WorkflowDocumentSimilarityEstimator implements DocumentSimilarityEstimator {

    private static final Logger logger = LoggerFactory.getLogger(WorkflowDocumentSimilarityEstimator.class);

    @Override
    public double computeSimilarity(String document1, String document2, int shingleSize, boolean wordGranularity) {
        logger.info("Constructing workflow");

        var workflow = new SimilarityWorkflow(wordGranularity, shingleSize);

        logger.info("Specifying input values");

        workflow.tokenizerAInput.setValue(document1);
        workflow.tokenizerBInput.setValue(document2);

        logger.info("Starting workflow");

        workflow.start();

        logger.info("Awaiting results");

        try {
            return workflow.await();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

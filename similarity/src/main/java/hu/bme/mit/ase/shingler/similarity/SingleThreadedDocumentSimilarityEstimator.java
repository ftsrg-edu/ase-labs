package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.CosineSimilarityComputor;
import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import hu.bme.mit.ase.shingler.lib.OccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.lib.Tokenizer;
import hu.bme.mit.ase.shingler.lib.VectorMultiplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SingleThreadedDocumentSimilarityEstimator implements DocumentSimilarityEstimator {

    private static final Logger logger = LoggerFactory.getLogger(SingleThreadedDocumentSimilarityEstimator.class);

    private final Tokenizer tokenizer;
    private final OccurrenceVectorComputor occurrenceVectorComputor ;
    private final VectorMultiplier vectorMultiplier;
    private final CosineSimilarityComputor cosineSimilarityComputor;

    public SingleThreadedDocumentSimilarityEstimator(Tokenizer tokenizer, OccurrenceVectorComputor occurrenceVectorComputor, VectorMultiplier vectorMultiplier, CosineSimilarityComputor cosineSimilarityComputor) {
        this.tokenizer = tokenizer;
        this.occurrenceVectorComputor = occurrenceVectorComputor;
        this.vectorMultiplier = vectorMultiplier;
        this.cosineSimilarityComputor = cosineSimilarityComputor;
    }

    @Override
    public double computeSimilarity(String document1, String document2, int shingleSize, boolean wordGranularity) {
        logger.info("Tokenizing input");

        var tokenizedDocument1 = tokenizer.tokenize(document1, wordGranularity);
        var tokenizedDocument2 = tokenizer.tokenize(document2, wordGranularity);

        logger.info("Calculating occurrence vectors");

        var a = occurrenceVectorComputor.calculateOccurrenceVector(tokenizedDocument1, shingleSize);
        var b = occurrenceVectorComputor.calculateOccurrenceVector(tokenizedDocument2, shingleSize);

        logger.info("Calculating scalar products");

        var aa = vectorMultiplier.computeScalarProduct(a, a);
        var ab = vectorMultiplier.computeScalarProduct(a, b);
        var bb = vectorMultiplier.computeScalarProduct(b, b);

        logger.info("Computing cosine similarity");

        return cosineSimilarityComputor.computeCosineSimilarity(aa, ab, bb);
    }

}

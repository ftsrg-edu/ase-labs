package hu.bme.mit.ase.shingler.similarity;

import hu.bme.mit.ase.shingler.lib.CosineSimilarityComputor;
import hu.bme.mit.ase.shingler.lib.DocumentSimilarityEstimator;
import hu.bme.mit.ase.shingler.lib.OccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.lib.Tokenizer;
import hu.bme.mit.ase.shingler.lib.VectorMultiplier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class MultiThreadedDocumentSimilarityEstimator implements DocumentSimilarityEstimator {

    private static final Logger logger = LoggerFactory.getLogger(MultiThreadedDocumentSimilarityEstimator.class);

    private final Tokenizer tokenizer;
    private final OccurrenceVectorComputor occurrenceVectorComputor ;
    private final VectorMultiplier vectorMultiplier;
    private final CosineSimilarityComputor cosineSimilarityComputor;

    public MultiThreadedDocumentSimilarityEstimator(Tokenizer tokenizer, OccurrenceVectorComputor occurrenceVectorComputor, VectorMultiplier vectorMultiplier, CosineSimilarityComputor cosineSimilarityComputor) {
        this.tokenizer = tokenizer;
        this.occurrenceVectorComputor = occurrenceVectorComputor;
        this.vectorMultiplier = vectorMultiplier;
        this.cosineSimilarityComputor = cosineSimilarityComputor;
    }

    public double computeSimilarityMultiThreaded(String document1, String document2, int shingleSize, boolean wordGranularity) throws ExecutionException, InterruptedException {
        logger.info("Starting input tokenization");

        // Tokenize documents in parallel
        var futureTokenizedDoc1 = CompletableFuture.supplyAsync(() ->
                tokenizer.tokenize(document1, wordGranularity)
        );

        var futureTokenizedDoc2 = CompletableFuture.supplyAsync(() ->
                tokenizer.tokenize(document2, wordGranularity)
        );

        // Wait for tokenization to complete
        var tokenizedDocument1 = futureTokenizedDoc1.get();
        var tokenizedDocument2 = futureTokenizedDoc2.get();

        logger.info("Starting occurrence vector calculation");

        // Calculate occurrence vectors in parallel
        var futureA = CompletableFuture.supplyAsync(() ->
                occurrenceVectorComputor.calculateOccurrenceVector(tokenizedDocument1, shingleSize)
        );

        var futureB = CompletableFuture.supplyAsync(() ->
                occurrenceVectorComputor.calculateOccurrenceVector(tokenizedDocument2, shingleSize)
        );

        // Wait for occurrence vector calculations
        var a = futureA.get();
        var b = futureB.get();

        logger.info("Starting vector multiplications");

        // Compute scalar products in parallel
        var futureAA = CompletableFuture.supplyAsync(() ->
                vectorMultiplier.computeScalarProduct(a, a)
        );

        var futureAB = CompletableFuture.supplyAsync(() ->
                vectorMultiplier.computeScalarProduct(a, b)
        );

        var futureBB = CompletableFuture.supplyAsync(() ->
                vectorMultiplier.computeScalarProduct(b, b)
        );

        // Wait for scalar products to complete
        var aa = futureAA.get();
        var ab = futureAB.get();
        var bb = futureBB.get();

        logger.info("Computing cosine similarity");

        var futureSimilarity = CompletableFuture.supplyAsync(() ->
                cosineSimilarityComputor.computeCosineSimilarity(aa, ab, bb)
        );

        // Wait for result
        return futureSimilarity.get();
    }

    @Override
    public double computeSimilarity(String document1, String document2, int shingleSize, boolean wordGranularity) {
        // Box all exceptions into RuntimeException type
        try {
            return computeSimilarityMultiThreaded(document1, document2, shingleSize, wordGranularity);
        } catch (Throwable e) {
            throw new RuntimeException(e);
        }
    }
}

package hu.bme.mit.ase.shingler.lib;

public interface DocumentSimilarityEstimator {

    double computeSimilarity(String document1, String document2, int shingleSize, boolean wordGranularity);

}

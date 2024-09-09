package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.CosineSimilarityComputor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseCosineSimilarityComputor implements CosineSimilarityComputor {

    private static final Logger logger = LoggerFactory.getLogger(BaseCosineSimilarityComputor.class);

    @Override
    public double computeCosineSimilarity(double aa, double ab, double bb) {
        logger.info("Computing cosine similarity of aa={}, ab={}, bb={}", aa, ab, bb);

        return ab / Math.sqrt(aa * bb);
    }

}

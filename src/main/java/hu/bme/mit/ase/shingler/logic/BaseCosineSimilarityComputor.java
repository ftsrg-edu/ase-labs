package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.CosineSimilarityComputor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class BaseCosineSimilarityComputor implements CosineSimilarityComputor {

    private static final Logger logger = LogManager.getLogger(BaseCosineSimilarityComputor.class);

    @Override
    public double computeCosineSimilarity(double aa, double ab, double bb) {
        logger.info("Computing cosine similarity of aa={}, ab={}, bb={}", aa, ab, bb);

        return ab / Math.sqrt(aa * bb);
    }

}

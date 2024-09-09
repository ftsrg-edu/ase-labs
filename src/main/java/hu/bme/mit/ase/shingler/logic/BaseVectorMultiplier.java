package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.VectorMultiplier;
import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashSet;
import java.util.List;

public class BaseVectorMultiplier implements VectorMultiplier {

    private static final Logger logger = LogManager.getLogger(BaseVectorMultiplier.class);

    @Override
    public double computeScalarProduct(OccurrenceVector u, OccurrenceVector v) {
        logger.info("Computing scalar product of u={} * v={}", u, v);

        var keys = new HashSet<>(u.keySet());
        keys.retainAll(v.keySet());

        double output = 0;

        for (List<String> key : keys) {
            output += u.get(key) * v.get(key);
        }

        return output;
    }

}

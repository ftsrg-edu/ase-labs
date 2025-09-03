package hu.bme.mit.ase.shingler.lib;

import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;

public interface VectorMultiplier {

    double computeScalarProduct(OccurrenceVector u, OccurrenceVector v);

}

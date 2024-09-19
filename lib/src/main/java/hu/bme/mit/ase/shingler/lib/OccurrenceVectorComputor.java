package hu.bme.mit.ase.shingler.lib;

import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;

public interface OccurrenceVectorComputor {

    OccurrenceVector calculateOccurrenceVector(TokenizedDocument document, int size);

}

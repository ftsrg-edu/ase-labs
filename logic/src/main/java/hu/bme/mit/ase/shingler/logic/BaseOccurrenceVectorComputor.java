package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.OccurrenceVectorComputor;
import hu.bme.mit.ase.shingler.lib.data.OccurrenceVector;
import hu.bme.mit.ase.shingler.lib.data.Shingle;
import hu.bme.mit.ase.shingler.lib.data.TokenVector;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

public class BaseOccurrenceVectorComputor implements OccurrenceVectorComputor {

    private static final Logger logger = LoggerFactory.getLogger(BaseOccurrenceVectorComputor.class);

    @Override
    public OccurrenceVector calculateOccurrenceVector(TokenizedDocument document, int size) {
        logger.info("Calculating occurrence vector ({}) with size={}", document, size);

        var shingles = new ArrayList<Shingle>();

        for (TokenVector tokenVector : document) {
            collectShingles(shingles, tokenVector, size);
        }

        return computeOccurrences(shingles);
    }

    private void collectShingles(List<Shingle> shingles, TokenVector vector, int s) {
        int leftIndex = 0;
        int rightIndex = 0;

        while (rightIndex < s && rightIndex < vector.size()) {
            rightIndex++;

            shingles.add(new Shingle(vector.subList(leftIndex, rightIndex)));
        }

        while (rightIndex < vector.size()) {
            leftIndex++;
            rightIndex++;
            shingles.add(new Shingle(vector.subList(leftIndex, rightIndex)));
        }

        while (leftIndex < rightIndex - 1) {
            leftIndex++;
            shingles.add(new Shingle(vector.subList(leftIndex, rightIndex)));
        }
    }

    private OccurrenceVector computeOccurrences(List<Shingle> shingles) {
        var occurrenceVector = new OccurrenceVector();

        for (var shingle : shingles) {
            occurrenceVector.merge(shingle, 1, Integer::sum);
        }

        return occurrenceVector;
    }

}

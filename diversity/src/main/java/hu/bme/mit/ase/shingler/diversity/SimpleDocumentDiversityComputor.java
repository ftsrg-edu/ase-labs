package hu.bme.mit.ase.shingler.diversity;

import hu.bme.mit.ase.shingler.lib.DiversityListComputor;
import hu.bme.mit.ase.shingler.lib.DocumentDiversityComputor;
import hu.bme.mit.ase.shingler.lib.Tokenizer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class SimpleDocumentDiversityComputor implements DocumentDiversityComputor {

    private static final Logger logger = LoggerFactory.getLogger(SimpleDocumentDiversityComputor.class);

    private final Tokenizer tokenizer;
    private final DiversityListComputor diversityListComputor;

    public SimpleDocumentDiversityComputor(Tokenizer tokenizer, DiversityListComputor diversityListComputor) {
        this.tokenizer = tokenizer;
        this.diversityListComputor = diversityListComputor;
    }

    @Override
    public List<Integer> computeDiversity(String document, boolean wordGranularity) {
        logger.info("Computing diversity list");

        var tokenizedDocument = tokenizer.tokenize(document, wordGranularity);
        return diversityListComputor.computeDiversityList(tokenizedDocument);
    }

}

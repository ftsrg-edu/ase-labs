package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.DiversityListComputor;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashSet;
import java.util.List;

public class BaseDiversityListComputor implements DiversityListComputor {

    private static final Logger logger = LogManager.getLogger(BaseDiversityListComputor.class);

    @Override
    public List<Integer> computeDiversityList(TokenizedDocument document) {
        logger.info("Computing diversity of document {}", document);

        return document.stream().map(HashSet::new).map(HashSet::size).toList();
    }

}

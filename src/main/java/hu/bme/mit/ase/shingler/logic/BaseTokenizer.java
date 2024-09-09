package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.Tokenizer;
import hu.bme.mit.ase.shingler.lib.data.TokenVector;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.regex.Pattern;

public class BaseTokenizer implements Tokenizer {

    private static final Logger logger = LogManager.getLogger(BaseTokenizer.class);

    private final static Pattern sentencesPattern = Pattern.compile("[?!.]");
    private final static Pattern wordsPattern = Pattern.compile("[^a-z0-9]");
    private final static Pattern charactersPattern = Pattern.compile("");

    @Override
    public TokenizedDocument tokenize(String document, boolean isWordGranularity) {
        logger.info("Tokenizing document with word granularity = {}", isWordGranularity);

        var normalizedDocument = document.toLowerCase();

        if (isWordGranularity) {
            return tokenize(normalizedDocument, sentencesPattern, wordsPattern);
        } else {
            return tokenize(normalizedDocument, wordsPattern, charactersPattern);
        }
    }

    private TokenizedDocument tokenize(String document, Pattern sentencePattern, Pattern wordPattern) {
        return new TokenizedDocument(
                sentencePattern.splitAsStream(document)
                        .filter(s -> !s.isEmpty())
                        .map(s ->
                                new TokenVector(
                                        wordPattern.splitAsStream(s)
                                                .filter(w -> !w.isEmpty())
                                                .toList()
                                )
                        )
                        .toList()
        );
    }

}

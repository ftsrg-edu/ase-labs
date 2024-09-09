package hu.bme.mit.ase.shingler.lib;

import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;

public interface Tokenizer {

    TokenizedDocument tokenize(String document, boolean wordGranularity);

}

package hu.bme.mit.ase.shingler.workflow.impl;

import hu.bme.mit.ase.shingler.lib.Tokenizer;
import hu.bme.mit.ase.shingler.lib.data.TokenizedDocument;
import hu.bme.mit.ase.shingler.logic.BaseTokenizer;
import hu.bme.mit.ase.shingler.workflow.lib.Pin;
import hu.bme.mit.ase.shingler.workflow.lib.Worker;

import java.util.concurrent.TimeoutException;

public class TokenizerWorker extends Worker<TokenizedDocument> {

    private final boolean wordGranularity;

    private final Tokenizer tokenizer = new BaseTokenizer();

    public final Pin<String> inputPin = new Pin<>();

    public TokenizerWorker(boolean wordGranularity) {
        this.wordGranularity = wordGranularity;
    }

    @Override
    protected TokenizedDocument computeResult() throws InterruptedException, TimeoutException {
        var document = inputPin.getValue();
        return tokenizer.tokenize(document, wordGranularity);
    }

}

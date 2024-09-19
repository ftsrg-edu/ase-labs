package hu.bme.mit.ase.shingler.logic;

import hu.bme.mit.ase.shingler.lib.Tokenizer;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TokenizerTests {

    private static final Tokenizer tokenizer = new BaseTokenizer();

    @Test
    public void tokenizerShouldRespectCharGranularity() {
        var tokens = tokenizer.tokenize("banana anana", false);

        Assertions.assertEquals(2, tokens.size());
        Assertions.assertArrayEquals("banana".split(""), tokens.get(0).toArray());
        Assertions.assertArrayEquals("anana".split(""), tokens.get(1).toArray());
    }

    @Test
    public void tokenizerShouldRespectWordGranularity() {
        var tokens = tokenizer.tokenize("banana anana", true);

        Assertions.assertEquals(1, tokens.size());
        Assertions.assertEquals(2, tokens.get(0).size());
        Assertions.assertEquals("banana", tokens.get(0).get(0));
        Assertions.assertEquals("anana", tokens.get(0).get(1));
    }

}

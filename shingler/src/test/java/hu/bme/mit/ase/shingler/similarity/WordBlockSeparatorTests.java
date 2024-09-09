package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class WordBlockSeparatorTests extends TestBase {

    @Test
    public void spaceSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void fullStopSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc.d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void semicolonSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc;d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void exclamationSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc!d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void questionSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc?d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void commaSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc,d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void colonSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc:d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void dashSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc-d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void parenthesisSeparates() {
        testSimilarity(4.0 / 5.0,
                "abc(d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }
}

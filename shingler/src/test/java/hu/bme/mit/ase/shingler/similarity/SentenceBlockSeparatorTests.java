package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class SentenceBlockSeparatorTests extends TestBase {

    @Test
    public void fullStopSeparates() {
        testSimilarity(4.0 / 5.0,
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @Test
    public void semicolonSeparates() {
        testSimilarity(1.0,
                "a1 b1 c1; d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @Test
    public void exclamationSeparates() {
        testSimilarity(4.0 / 5.0,
                "a1 b1 c1! d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @Test
    public void questionSeparates() {
        testSimilarity(4.0 / 5.0,
                "a1 b1 c1? d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @Test
    public void commaSeparatesNot() {
        testSimilarity(1.0,
                "a1 b1 c1,d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @Test
    public void colonSeparatesNot() {
        testSimilarity(1.0,
                "a1 b1 c1:d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @Test
    public void dashSeparatesNot() {
        testSimilarity(1.0,
                "a1 b1 c1-d1",
                "a1 b1 c1 d1",
                2, true);
    }

    @Test
    public void parenthesisSeparatesNot() {
        testSimilarity(1.0,
                "a1 b1 c1(d1",
                "a1 b1 c1 d1",
                2, true);
    }

}

package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class BlockBoundaryTests extends TestBase {

    @Test
    public void duplicatedBlockChars() {
        testSimilarity(1.0,
                "abcdefgh abcdefgh",
                "abcdefgh",
                2, false);
    }

    @Test
    public void duplicatedBlockWords() {
        testSimilarity(1.0,
                "a1 b1 c1 d1 e1 f1 g1 h1. a1 b1 c1 d1 e1 f1 g1 h1",
                "a1 b1 c1 d1 e1 f1 g1 h1",
                2, true);
    }

    @Test
    public void blockOrderIndependentChars() {
        testSimilarity(1.0,
                "abcdefgh ijklm",
                "ijklm abcdefgh",
                2, false);
    }

    @Test
    public void blockOrderIndependentWords() {
        testSimilarity(1.0,
                "a1 b1 c1 d1 e1 f1 g1 h1. i1 j1 k1 l1 m1",
                "i1 j1 k1 l1 m1. a1 b1 c1 d1 e1 f1 g1 h1",
                2, true);
    }

    @Test
    public void blockBoundaryPresenceMattersChars() {
        testSimilarity(4.0 / 5.0,
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                "abcd", // a->1, ab->1, bc->1, cd->1, d->1
                2, false);
    }

    @Test
    public void blockBoundaryPresenceMattersWords() {
        testSimilarity(4.0 / 5.0,
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                "a1 b1 c1 d1", // a->1, ab->1, bc->1, cd->1, d->1
                2, true);
    }

    @Test
    public void blockBoundaryPositionMattersChars() {
        testSimilarity(4.0 / Math.sqrt(6 * 5),
                "ab cd", // a->1, ab->1, b->1, c->1, cd->1, d->1
                "abc d", // a->1, ab->1, bc->1, c->1, d->1
                2, false);
    }

    @Test
    public void blockBoundaryPositionMattersWords() {
        testSimilarity(4.0 / Math.sqrt(6 * 5),
                "a1 b1. c1 d1", // a->1, ab->1, b->1, c->1, cd->1, d->1
                "a1 b1 c1. d1", // a->1, ab->1, bc->1, c->1, d->1
                2, true);
    }

    @Test
    public void blockHeadsTailsChars() {
        testSimilarity(7.0 / Math.sqrt(11 * 9),
                "abc ab", // a->2, ab->2, bc->1, c->1, b->1
                "ab cdb", // a->1, ab->1, b->2, c->1, cd->1, db->1
                2, false);
    }

    @Test
    public void blockHeadsTailsWords() {
        testSimilarity(7.0 / Math.sqrt(11 * 9),
                "a1 b1 c1. a1 b1", // a1->2, b1->2, c1->1
                "a1 b1. c1 d1 b1", // a1->1, b1->2, c1->1, d1->1
                2, true);
    }

}

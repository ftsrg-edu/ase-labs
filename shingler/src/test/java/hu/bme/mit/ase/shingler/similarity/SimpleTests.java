package hu.bme.mit.ase.shingler.similarity;

import org.junit.jupiter.api.Test;

public class SimpleTests extends TestBase {

    @Test
    public void fruitTest() {
        testSimilarity(9.0 / 11.0,
                "Banana",
                "Ananas",
                2, false);

        testSimilarity(9.0 / 11.0,
                "Banana",
                "Ananas",
                2, false);
    }

}

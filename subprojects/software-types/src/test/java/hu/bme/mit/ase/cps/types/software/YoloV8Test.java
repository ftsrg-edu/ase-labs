package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class YoloV8Test {

    @Test
    @DisplayName("YoloV8 should return correct name")
    void testYoloV8GetName() {
        var yoloV8 = new YoloV8();
        Assertions.assertEquals("YoloV8", yoloV8.getName(),
                "Expected YoloV8's getName() to return 'YoloV8'");
    }

    @Test
    @DisplayName("YoloV8 should return correct description")
    void testYoloV8GetDescription() {
        var yoloV8 = new YoloV8();
        Assertions.assertEquals("Object detection framework version 8", yoloV8.getDescription(),
                "Expected YoloV8's getDescription() to return 'Object detection framework version 8'");
    }

    @Test
    @DisplayName("YoloV8 should return correct port")
    void testYoloV8GetPort() {
        var yoloV8 = new YoloV8();
        Assertions.assertEquals(-1, yoloV8.getPort(),
                "Expected YoloV8's getPort() to return -1 as no port is specified");
    }

    @Test
    @DisplayName("YoloV8 should have no dependencies")
    void testYoloV8GetDependencies() {
        var yoloV8 = new YoloV8();
        Assertions.assertTrue(yoloV8.getDependencies().isEmpty(),
                "Expected YoloV8 to have no dependencies, but some were found");
    }
}

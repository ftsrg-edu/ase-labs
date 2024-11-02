package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

public class YoloV10Test {

    @Test
    @DisplayName("YoloV10 should return correct name")
    void testYoloV10GetName() {
        var yoloV10 = new YoloV10();
        Assertions.assertEquals("YoloV10", yoloV10.getName(),
                "Expected YoloV10's getName() to return 'YoloV10'");
    }

    @Test
    @DisplayName("YoloV10 should return correct description")
    void testYoloV10GetDescription() {
        var yoloV10 = new YoloV10();
        Assertions.assertEquals("Object detection framework version 10 with improved accuracy", yoloV10.getDescription(),
                "Expected YoloV10's getDescription() to return 'Object detection framework version 10 with improved accuracy'");
    }

    @Test
    @DisplayName("YoloV10 should return correct port")
    void testYoloV10GetPort() {
        var yoloV10 = new YoloV10();
        Assertions.assertEquals(-1, yoloV10.getPort(),
                "Expected YoloV10's getPort() to return -1 as no port is specified");
    }

    @Test
    @DisplayName("YoloV10 should return correct dependencies")
    void testYoloV10GetDependencies() {
        var yoloV10 = new YoloV10();
        Assertions.assertEquals(List.of("OpenCV"), yoloV10.getDependencies(),
                "Expected YoloV10 to depend on 'OpenCV' only, but dependencies differed");
    }
}

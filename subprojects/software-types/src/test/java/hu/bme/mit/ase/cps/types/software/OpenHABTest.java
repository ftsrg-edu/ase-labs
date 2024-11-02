package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;

import java.util.List;

public class OpenHABTest {

    @Test
    @DisplayName("OpenHAB should return correct name")
    void testOpenHABGetName() {
        var openHAB = new OpenHAB();
        Assertions.assertEquals("OpenHAB", openHAB.getName(),
                "Expected OpenHAB's getName() to return 'OpenHAB'");
    }

    @Test
    @DisplayName("OpenHAB should return correct description")
    void testOpenHABGetDescription() {
        var openHAB = new OpenHAB();
        Assertions.assertEquals("Open-source home automation software", openHAB.getDescription(),
                "Expected OpenHAB's getDescription() to return 'Open-source home automation software'");
    }

    @Test
    @DisplayName("OpenHAB should return correct port")
    void testOpenHABGetPort() {
        var openHAB = new OpenHAB();
        Assertions.assertEquals(-1, openHAB.getPort(),
                "Expected OpenHAB's getPort() to return -1 as no port is specified");
    }

    @Test
    @DisplayName("OpenHAB should return correct dependencies")
    void testOpenHABGetDependencies() {
        var openHAB = new OpenHAB();
        Assertions.assertEquals(List.of("OpenCV", "MQTTBroker"), openHAB.getDependencies(),
                "Expected OpenHAB to depend on 'OpenCV' and 'MQTTBroker' only, but dependencies differed");
    }
}

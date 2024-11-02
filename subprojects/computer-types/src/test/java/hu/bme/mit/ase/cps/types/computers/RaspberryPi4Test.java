package hu.bme.mit.ase.cps.types.computers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class RaspberryPi4Test {

    @Test
    @DisplayName("RaspberryPi4 should be constructable with name and IP parameters")
    void raspberryPi4ShouldBeConstructable() {
        new RaspberryPi4("pi4-1", "192.168.0.102");
    }

    @Test
    @DisplayName("RaspberryPi4 should correctly return name and IP after construction")
    void raspberryPi4ConstructorShouldSetFields() {
        var pi4 = new RaspberryPi4("pi4-1", "192.168.0.102");
        Assertions.assertAll(
                () -> Assertions.assertEquals("pi4-1", pi4.getName(), "Expected RaspberryPi4 name to be 'pi4-1', but was '" + pi4.getName() + "'"),
                () -> Assertions.assertEquals("192.168.0.102", pi4.getIp(), "Expected RaspberryPi4 IP to be '192.168.0.102', but was '" + pi4.getIp() + "'")
        );
    }

    @Test
    @DisplayName("RaspberryPi4 should return correct OS")
    void testRaspberryPi4GetOs() {
        var pi4 = new RaspberryPi4("pi4-1", "192.168.0.102");
        Assertions.assertEquals("RaspberryPiOS", pi4.getOs(), "Expected RaspberryPi4 OS to be 'RaspberryPiOS', but was '" + pi4.getOs() + "'");
    }

    @Test
    @DisplayName("RaspberryPi4 should return correct description")
    void testRaspberryPi4GetDescription() {
        var pi4 = new RaspberryPi4("pi4-1", "192.168.0.102");
        Assertions.assertEquals("Improved model with enhanced performance", pi4.getDescription(),
                "Expected RaspberryPi4 description to be 'Improved model with enhanced performance', but was '" + pi4.getDescription() + "'");
    }

    @Test
    @DisplayName("RaspberryPi4 should return correct resources")
    void testRaspberryPi4GetResources() {
        var pi4 = new RaspberryPi4("pi4-1", "192.168.0.102");
        var resources = pi4.getResources();
        Assertions.assertAll(
                () -> Assertions.assertEquals("4GB", resources.getMemory(), "Expected RaspberryPi4 memory to be '4GB', but was '" + resources.getMemory() + "'"),
                () -> Assertions.assertEquals("4-core ARM Cortex-A72", resources.getCpu(), "Expected RaspberryPi4 CPU to be '4-core ARM Cortex-A72', but was '" + resources.getCpu() + "'"),
                () -> Assertions.assertEquals("32GB", resources.getStorage(), "Expected RaspberryPi4 storage to be '32GB', but was '" + resources.getStorage() + "'")
        );
    }

}

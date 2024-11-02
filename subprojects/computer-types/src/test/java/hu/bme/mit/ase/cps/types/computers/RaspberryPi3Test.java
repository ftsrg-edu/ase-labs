package hu.bme.mit.ase.cps.types.computers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class RaspberryPi3Test {

    @Test
    @DisplayName("RaspberryPi3 should be constructable with name and IP parameters")
    void raspberryPi3ShouldBeConstructable() {
        new RaspberryPi3("pi3-1", "192.168.0.101");
    }

    @Test
    @DisplayName("RaspberryPi3 should correctly return name and IP after construction")
    void raspberryPi3ConstructorShouldSetFields() {
        var pi3 = new RaspberryPi3("pi3-1", "192.168.0.101");
        Assertions.assertAll(
                () -> Assertions.assertEquals("pi3-1", pi3.getName(), "Expected RaspberryPi3 name to be 'pi3-1', but was '" + pi3.getName() + "'"),
                () -> Assertions.assertEquals("192.168.0.101", pi3.getIp(), "Expected RaspberryPi3 IP to be '192.168.0.101', but was '" + pi3.getIp() + "'")
        );
    }

    @Test
    @DisplayName("RaspberryPi3 should return correct OS")
    void testRaspberryPi3GetOs() {
        var pi3 = new RaspberryPi3("pi3-1", "192.168.0.101");
        Assertions.assertEquals("RaspberryPiOS", pi3.getOs(), "Expected RaspberryPi3 OS to be 'RaspberryPiOS', but was '" + pi3.getOs() + "'");
    }

    @Test
    @DisplayName("RaspberryPi3 should return correct description")
    void testRaspberryPi3GetDescription() {
        var pi3 = new RaspberryPi3("pi3-1", "192.168.0.101");
        Assertions.assertEquals("Entry-level computer for lightweight tasks", pi3.getDescription(),
                "Expected RaspberryPi3 description to be 'Entry-level computer for lightweight tasks', but was '" + pi3.getDescription() + "'");
    }

    @Test
    @DisplayName("RaspberryPi3 should return correct resources")
    void testRaspberryPi3GetResources() {
        var pi3 = new RaspberryPi3("pi3-1", "192.168.0.101");
        var resources = pi3.getResources();
        Assertions.assertAll(
                () -> Assertions.assertEquals("1GB", resources.getMemory(), "Expected RaspberryPi3 memory to be '1GB', but was '" + resources.getMemory() + "'"),
                () -> Assertions.assertEquals("4-core ARM Cortex-A53", resources.getCpu(), "Expected RaspberryPi3 CPU to be '4-core ARM Cortex-A53', but was '" + resources.getCpu() + "'"),
                () -> Assertions.assertEquals("16GB", resources.getStorage(), "Expected RaspberryPi3 storage to be '16GB', but was '" + resources.getStorage() + "'")
        );
    }

}

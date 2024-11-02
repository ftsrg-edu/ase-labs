package hu.bme.mit.ase.cps.types.computers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class LaptopTest {

    @Test
    @DisplayName("Laptop should be constructable with name and IP parameters")
    void laptopShouldBeConstructable() {
        new Laptop("laptop-1", "192.168.0.104");
    }

    @Test
    @DisplayName("Laptop should correctly return name and IP after construction")
    void laptopConstructorShouldSetFields() {
        var laptop = new Laptop("laptop-1", "192.168.0.104");
        Assertions.assertAll(
                () -> Assertions.assertEquals("laptop-1", laptop.getName(), "Expected Laptop name to be 'laptop-1', but was '" + laptop.getName() + "'"),
                () -> Assertions.assertEquals("192.168.0.104", laptop.getIp(), "Expected Laptop IP to be '192.168.0.104', but was '" + laptop.getIp() + "'")
        );
    }

    @Test
    @DisplayName("Laptop should return correct OS")
    void testLaptopGetOs() {
        var laptop = new Laptop("laptop-1", "192.168.0.104");
        Assertions.assertEquals("Windows10", laptop.getOs(), "Expected Laptop OS to be 'Windows10', but was '" + laptop.getOs() + "'");
    }

    @Test
    @DisplayName("Laptop should return correct description")
    void testLaptopGetDescription() {
        var laptop = new Laptop("laptop-1", "192.168.0.104");
        Assertions.assertEquals("Portable computer for professional and personal use", laptop.getDescription(),
                "Expected Laptop description to be 'Portable computer for professional and personal use', but was '" + laptop.getDescription() + "'");
    }

    @Test
    @DisplayName("Laptop should return correct resources")
    void testLaptopGetResources() {
        var laptop = new Laptop("laptop-1", "192.168.0.104");
        var resources = laptop.getResources();
        Assertions.assertAll(
            () -> Assertions.assertEquals("8GB", resources.getMemory(), "Expected Laptop memory to be '8GB', but was '" + resources.getMemory() + "'"),
            () -> Assertions.assertEquals("4-core Intel i5", resources.getCpu(), "Expected Laptop CPU to be '4-core Intel i5', but was '" + resources.getCpu() + "'"),
            () -> Assertions.assertEquals("256GB", resources.getStorage(), "Expected Laptop storage to be '256GB', but was '" + resources.getStorage() + "'")
        );
    }

}

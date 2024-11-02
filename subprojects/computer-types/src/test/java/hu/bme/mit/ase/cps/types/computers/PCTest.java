package hu.bme.mit.ase.cps.types.computers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class PCTest {

    @Test
    @DisplayName("PC should be constructable with name and IP parameters")
    void pcShouldBeConstructable() {
        new PC("pc-1", "192.168.0.103");
    }

    @Test
    @DisplayName("PC should correctly return name and IP after construction")
    void pcConstructorShouldSetFields() {
        var pc = new PC("pc-1", "192.168.0.103");
        Assertions.assertAll(
                () -> Assertions.assertEquals("pc-1", pc.getName(), "Expected PC name to be 'pc-1', but was '" + pc.getName() + "'"),
                () -> Assertions.assertEquals("192.168.0.103", pc.getIp(), "Expected PC IP to be '192.168.0.103', but was '" + pc.getIp() + "'")
        );
    }

    @Test
    @DisplayName("PC should return correct OS")
    void testPCGetOs() {
        var pc = new PC("pc-1", "192.168.0.103");
        Assertions.assertEquals("UbuntuLinux", pc.getOs(), "Expected PC OS to be 'UbuntuLinux', but was '" + pc.getOs() + "'");
    }

    @Test
    @DisplayName("PC should return correct description")
    void testPCGetDescription() {
        var pc = new PC("pc-1", "192.168.0.103");
        Assertions.assertEquals("Standard desktop computer for general-purpose use", pc.getDescription(),
                "Expected PC description to be 'Standard desktop computer for general-purpose use', but was '" + pc.getDescription() + "'");
    }

    @Test
    @DisplayName("PC should return correct resources")
    void testPCGetResources() {
        var pc = new PC("pc-1", "192.168.0.103");
        var resources = pc.getResources();
        Assertions.assertAll(
                () -> Assertions.assertEquals("16GB", resources.getMemory(), "Expected PC memory to be '16GB', but was '" + resources.getMemory() + "'"),
                () -> Assertions.assertEquals("8-core Intel i7", resources.getCpu(), "Expected PC CPU to be '8-core Intel i7', but was '" + resources.getCpu() + "'"),
                () -> Assertions.assertEquals("512GB", resources.getStorage(), "Expected PC storage to be '512GB', but was '" + resources.getStorage() + "'")
        );
    }

}

package hu.bme.mit.ase.cps.types.computers;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class ServerTest {

    @Test
    @DisplayName("Server should be constructable with name and IP parameters")
    void serverShouldBeConstructable() {
        new Server("server-1", "192.168.0.105");
    }

    @Test
    @DisplayName("Server should correctly return name and IP after construction")
    void serverConstructorShouldSetFields() {
        var server = new Server("server-1", "192.168.0.105");
        Assertions.assertAll(
                () -> Assertions.assertEquals("server-1", server.getName(), "Expected Server name to be 'server-1', but was '" + server.getName() + "'"),
                () -> Assertions.assertEquals("192.168.0.105", server.getIp(), "Expected Server IP to be '192.168.0.105', but was '" + server.getIp() + "'")
        );
    }

    @Test
    @DisplayName("Server should return correct OS")
    void testServerGetOs() {
        var server = new Server("server-1", "192.168.0.105");
        Assertions.assertEquals("CentOS", server.getOs(), "Expected Server OS to be 'CentOS', but was '" + server.getOs() + "'");
    }

    @Test
    @DisplayName("Server should return correct description")
    void testServerGetDescription() {
        var server = new Server("server-1", "192.168.0.105");
        Assertions.assertEquals("High-performance server for enterprise applications", server.getDescription(),
                "Expected Server description to be 'High-performance server for enterprise applications', but was '" + server.getDescription() + "'");
    }

    @Test
    @DisplayName("Server should return correct resources")
    void testServerGetResources() {
        var server = new Server("server-1", "192.168.0.105");
        var resources = server.getResources();
        Assertions.assertAll(
                () -> Assertions.assertEquals("64GB", resources.getMemory(), "Expected Server memory to be '64GB', but was '" + resources.getMemory() + "'"),
                () -> Assertions.assertEquals("16-core AMD EPYC", resources.getCpu(), "Expected Server CPU to be '16-core AMD EPYC', but was '" + resources.getCpu() + "'"),
                () -> Assertions.assertEquals("2TB", resources.getStorage(), "Expected Server storage to be '2TB', but was '" + resources.getStorage() + "'")
        );
    }

}

package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class MQTTBrokerTest {

    @Test
    @DisplayName("MQTTBroker should return correct name")
    void testMQTTBrokerGetName() {
        var mqttBroker = new MQTTBroker();
        Assertions.assertEquals("MQTTBroker", mqttBroker.getName(),
                "Expected MQTTBroker's getName() to return 'MQTTBroker'");
    }

    @Test
    @DisplayName("MQTTBroker should return correct description")
    void testMQTTBrokerGetDescription() {
        var mqttBroker = new MQTTBroker();
        Assertions.assertEquals("Object detection framework version 8", mqttBroker.getDescription(),
                "Expected MQTTBroker's getDescription() to return 'Object detection framework version 8'");
    }

    @Test
    @DisplayName("MQTTBroker should return correct port")
    void testMQTTBrokerGetPort() {
        var mqttBroker = new MQTTBroker();
        Assertions.assertEquals(-1, mqttBroker.getPort(),
                "Expected MQTTBroker's getPort() to return -1 as no port is specified");
    }

    @Test
    @DisplayName("MQTTBroker should have no dependencies")
    void testMQTTBrokerGetDependencies() {
        var mqttBroker = new MQTTBroker();
        Assertions.assertTrue(mqttBroker.getDependencies().isEmpty(),
                "Expected MQTTBroker to have no dependencies, but some were found");
    }
}

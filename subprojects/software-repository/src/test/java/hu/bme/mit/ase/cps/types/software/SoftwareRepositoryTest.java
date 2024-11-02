package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Assertions;
import java.util.List;

public class SoftwareRepositoryTest {

    private SoftwareRepository repository;

    @BeforeEach
    void setup() {
        repository = new SoftwareRepository();
        repository.registerRepository();
    }

    @Test
    @DisplayName("Repository should register all expected software types")
    void testRegisterAllSoftwareTypes() {
        List<String> registeredSoftwareNames = repository.getRegisteredSoftwareNames();

        List<String> expectedSoftwareNames = List.of(
                "MQTTBroker",
                "YoloV8",
                "OpenCV",
                "YoloV10",
                "OpenHAB"
        );

        Assertions.assertAll(
                () -> Assertions.assertEquals(expectedSoftwareNames.size(), registeredSoftwareNames.size(),
                "Expected number of registered software to be " + expectedSoftwareNames.size() +
                        ", but found " + registeredSoftwareNames.size()),
                () -> Assertions.assertTrue(registeredSoftwareNames.containsAll(expectedSoftwareNames),
                "Repository should contain all expected software types: " + expectedSoftwareNames +
                        ", but found only: " + registeredSoftwareNames)
        );
    }

    @Test
    @DisplayName("Repository should register MQTTBroker with correct details")
    void testMQTTBrokerRegisteredCorrectly() {
        var mqttBroker = repository.getSoftwareByName("MQTTBroker");

        Assertions.assertAll(
                () -> Assertions.assertNotNull(mqttBroker, "Expected MQTTBroker to be registered, but it was not found"),
                () -> Assertions.assertEquals("Object detection framework version 8", mqttBroker.getDescription(),
                "MQTTBroker should have description 'Object detection framework version 8'")
        );
    }

    @Test
    @DisplayName("Repository should register YoloV8 with correct details")
    void testYoloV8RegisteredCorrectly() {
        var yoloV8 = repository.getSoftwareByName("YoloV8");

        Assertions.assertAll(
                () -> Assertions.assertNotNull(yoloV8, "Expected YoloV8 to be registered, but it was not found"),
                () -> Assertions.assertEquals("Object detection framework version 8", yoloV8.getDescription(),
                "YoloV8 should have description 'Object detection framework version 8'")
        );
    }

    @Test
    @DisplayName("Repository should register OpenCV with correct details")
    void testOpenCVRegisteredCorrectly() {
        var openCV = repository.getSoftwareByName("OpenCV");

        Assertions.assertAll(
                () -> Assertions.assertNotNull(openCV, "Expected OpenCV to be registered, but it was not found"),
                () -> Assertions.assertEquals("Open-source computer vision library", openCV.getDescription(),
                "OpenCV should have description 'Open-source computer vision library'")
        );
    }

    @Test
    @DisplayName("Repository should register YoloV10 with correct dependencies")
    void testYoloV10RegisteredWithDependencies() {
        var yoloV10 = repository.getSoftwareByName("YoloV10");

        Assertions.assertAll(
                () -> Assertions.assertNotNull(yoloV10, "Expected YoloV10 to be registered, but it was not found"),
                () -> Assertions.assertEquals("Object detection framework version 10 with improved accuracy", yoloV10.getDescription(),
                "YoloV10 should have description 'Object detection framework version 10 with improved accuracy'"),
                () -> Assertions.assertEquals(List.of("OpenCV"), yoloV10.getDependencies(),
                "YoloV10 should depend on 'OpenCV' only")
        );
    }

    @Test
    @DisplayName("Repository should register OpenHAB with correct dependencies")
    void testOpenHABRegisteredWithDependencies() {
        var openHAB = repository.getSoftwareByName("OpenHAB");

        Assertions.assertAll(
                () -> Assertions.assertNotNull(openHAB, "Expected OpenHAB to be registered, but it was not found"),
                () -> Assertions.assertEquals("Open-source home automation software", openHAB.getDescription(),
                "OpenHAB should have description 'Open-source home automation software'"),
                () -> Assertions.assertEquals(List.of("OpenCV", "MQTTBroker"), openHAB.getDependencies(),
                "OpenHAB should depend on 'OpenCV' and 'MQTTBroker' only")
        );
    }

}

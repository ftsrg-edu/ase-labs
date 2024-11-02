package hu.bme.mit.ase.cps.deployments;

import hu.bme.mit.ase.cps.types.computers.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;

public class IndustrialAutomationTest {

    private CPS cps;
    private IndustrialAutomation deployment;

    @BeforeEach
    void setUp() {
        cps = Mockito.spy(CPS.class);
        deployment = new IndustrialAutomation();
    }

    @Test
    @DisplayName("IndustrialAutomation should have correct name")
    void testName() {
        Assertions.assertEquals("IndustrialAutomation", deployment.getName());
    }

    @Test
    @DisplayName("Test computer deployment")
    void testDeployComputers() {
        deployment.deployComputers(cps);

        var size = cps.getDeployedComputers().size();
        var control_unit = cps.getComputerByName("control_unit");
        var sensor_node_1 = cps.getComputerByName("sensor_node_1");
        var sensor_node_2 = cps.getComputerByName("sensor_node_2");
        var data_processing_server = cps.getComputerByName("data_processing_server");

        Assertions.assertAll(
                () -> Assertions.assertEquals(4, size, "There should be exactly 4 deployed computers."),
                () -> Assertions.assertNotNull(control_unit, "Missing computer with name 'control_unit'"),
                () -> Assertions.assertNotNull(sensor_node_1, "Missing computer with name 'sensor_node_1'"),
                () -> Assertions.assertNotNull(sensor_node_2, "Missing computer with name 'sensor_node_2'"),
                () -> Assertions.assertNotNull(data_processing_server, "Missing computer with name 'data_processing_server'")
        );
    }

    @Test
    @DisplayName("Test control_unit computer deployment")
    void testControlUnit() {
        deployment.deployComputers(cps);

        var control_unit = cps.getComputerByName("control_unit");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(PC.class, control_unit, "control_unit should be of type 'PC'"),
                () -> Assertions.assertEquals("10.0.0.5", control_unit.getIp(), "control_unit should have ip '10.0.0.5'")
        );
    }

    @Test
    @DisplayName("Test install software on control_unit")
    void testInstallSoftwareOnControlUnit() {
        deployment.deployComputers(cps);

        var control_unit = cps.getComputerByName("control_unit");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(control_unit), eq("OpenHAB")),
                () -> verify(cps).installSoftware(eq(control_unit), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test sensor_node_1 computer deployment")
    void testSensorNode1() {
        deployment.deployComputers(cps);

        var sensor_node_1 = cps.getComputerByName("sensor_node_1");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(RaspberryPi3.class, sensor_node_1, "sensor_node_1 should be of type 'RaspberryPi3'"),
                () -> Assertions.assertEquals("10.0.0.6", sensor_node_1.getIp(), "sensor_node_1 should have ip '10.0.0.6'")
        );
    }

    @Test
    @DisplayName("Test install software on sensor_node_1")
    void testInstallSoftwareOnSensorNode1() {
        deployment.deployComputers(cps);

        var sensor_node_1 = cps.getComputerByName("sensor_node_1");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(sensor_node_1), eq("YoloV8"))
        );
    }

    @Test
    @DisplayName("Test sensor_node_2 computer deployment")
    void testSensorNode2() {
        deployment.deployComputers(cps);

        var sensor_node_2 = cps.getComputerByName("sensor_node_2");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(RaspberryPi3.class, sensor_node_2, "sensor_node_2 should be of type 'RaspberryPi3'"),
                () -> Assertions.assertEquals("10.0.0.7", sensor_node_2.getIp(), "sensor_node_2 should have ip '10.0.0.7'")
        );
    }

    @Test
    @DisplayName("Test install software on sensor_node_2")
    void testInstallSoftwareOnSensorNode2() {
        deployment.deployComputers(cps);

        var sensor_node_2 = cps.getComputerByName("sensor_node_2");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(sensor_node_2), eq("YoloV8"))
        );
    }

    @Test
    @DisplayName("Test data_processing_server computer deployment")
    void testDataProcessingServer() {
        deployment.deployComputers(cps);

        var data_processing_server = cps.getComputerByName("data_processing_server");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(Server.class, data_processing_server, "data_processing_server should be of type 'Server'"),
                () -> Assertions.assertEquals("10.0.0.20", data_processing_server.getIp(), "data_processing_server should have ip '10.0.0.20'")
        );
    }

    @Test
    @DisplayName("Test install software on data_processing_server")
    void testInstallSoftwareOnDataProcessingServer() {
        deployment.deployComputers(cps);

        var data_processing_server = cps.getComputerByName("data_processing_server");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(data_processing_server), eq("YoloV10")),
                () -> verify(cps).installSoftware(eq(data_processing_server), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test computer connections")
    void testConnections() {
        deployment.deployComputers(cps);

        var sensor_node_1 = cps.getComputerByName("sensor_node_1");
        var sensor_node_2 = cps.getComputerByName("sensor_node_2");
        var data_processing_server = cps.getComputerByName("data_processing_server");
        var control_unit = cps.getComputerByName("control_unit");

        Assertions.assertAll(
                () -> Assertions.assertEquals(3, cps.getNumberOfConnections(), "Deployment should make exactly 3 connection pairs!"),
                () -> Assertions.assertTrue(cps.hasConnection(sensor_node_1, data_processing_server), "Missing connection: (sensor_node_1, data_processing_server)"),
                () -> Assertions.assertTrue(cps.hasConnection(sensor_node_2, data_processing_server), "Missing connection: (sensor_node_2, data_processing_server)"),
                () -> Assertions.assertTrue(cps.hasConnection(data_processing_server, control_unit), "Missing connection: (data_processing_server, control_unit)")
        );
    }

}

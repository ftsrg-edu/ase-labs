package hu.bme.mit.ase.cps.deployments;

import hu.bme.mit.ase.cps.types.computers.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;

public class SmartCityTrafficManagementTest {

    private CPS cps;
    private SmartCityTrafficManagement deployment;

    @BeforeEach
    void setUp() {
        cps = Mockito.spy(CPS.class);
        deployment = new SmartCityTrafficManagement();
    }

    @Test
    @DisplayName("SmartCityTrafficManagement should have correct name")
    void testName() {
        Assertions.assertEquals("SmartCityTrafficManagement", deployment.getName());
    }

    @Test
    @DisplayName("Test computer deployment")
    void testDeployComputers() {
        deployment.deployComputers(cps);

        var size = cps.getDeployedComputers().size();
        var central_hub = cps.getComputerByName("central_hub");
        var traffic_camera_1 = cps.getComputerByName("traffic_camera_1");
        var traffic_camera_2 = cps.getComputerByName("traffic_camera_2");
        var data_analytics_node = cps.getComputerByName("data_analytics_node");
        var monitoring_laptop = cps.getComputerByName("monitoring_laptop");

        Assertions.assertAll(
                () -> Assertions.assertEquals(5, size, "There should be exactly 5 deployed computers."),
                () -> Assertions.assertNotNull(central_hub, "Missing computer with name 'central_hub'"),
                () -> Assertions.assertNotNull(traffic_camera_1, "Missing computer with name 'traffic_camera_1'"),
                () -> Assertions.assertNotNull(traffic_camera_2, "Missing computer with name 'traffic_camera_2'"),
                () -> Assertions.assertNotNull(data_analytics_node, "Missing computer with name 'data_analytics_node'"),
                () -> Assertions.assertNotNull(monitoring_laptop, "Missing computer with name 'monitoring_laptop'")
        );
    }

    @Test
    @DisplayName("Test central_hub computer deployment")
    void testCentralHub() {
        deployment.deployComputers(cps);

        var central_hub = cps.getComputerByName("central_hub");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(Server.class, central_hub, "central_hub should be of type 'Server'"),
                () -> Assertions.assertEquals("192.168.100.1", central_hub.getIp(), "central_hub should have ip '192.168.100.1'")
        );
    }

    @Test
    @DisplayName("Test install software on central_hub")
    void testInstallSoftwareOnCentralHub() {
        deployment.deployComputers(cps);

        var central_hub = cps.getComputerByName("central_hub");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(central_hub), eq("OpenHAB")),
                () -> verify(cps).installSoftware(eq(central_hub), eq("YoloV10")),
                () -> verify(cps).installSoftware(eq(central_hub), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test traffic_camera_1 computer deployment")
    void testTrafficCamera1() {
        deployment.deployComputers(cps);

        var traffic_camera_1 = cps.getComputerByName("traffic_camera_1");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(RaspberryPi4.class, traffic_camera_1, "traffic_camera_1 should be of type 'RaspberryPi4'"),
                () -> Assertions.assertEquals("192.168.100.2", traffic_camera_1.getIp(), "traffic_camera_1 should have ip '192.168.100.2'")
        );
    }

    @Test
    @DisplayName("Test install software on traffic_camera_1")
    void testInstallSoftwareOnTrafficCamera1() {
        deployment.deployComputers(cps);

        var traffic_camera_1 = cps.getComputerByName("traffic_camera_1");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(traffic_camera_1), eq("YoloV8")),
                () -> verify(cps).installSoftware(eq(traffic_camera_1), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test traffic_camera_2 computer deployment")
    void testTrafficCamera2() {
        deployment.deployComputers(cps);

        var traffic_camera_2 = cps.getComputerByName("traffic_camera_2");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(RaspberryPi4.class, traffic_camera_2, "traffic_camera_2 should be of type 'RaspberryPi4'"),
                () -> Assertions.assertEquals("192.168.100.3", traffic_camera_2.getIp(), "traffic_camera_2 should have ip '192.168.100.3'")
        );
    }

    @Test
    @DisplayName("Test install software on traffic_camera_2")
    void testInstallSoftwareOnTrafficCamera2() {
        deployment.deployComputers(cps);

        var traffic_camera_2 = cps.getComputerByName("traffic_camera_2");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(traffic_camera_2), eq("YoloV8")),
                () -> verify(cps).installSoftware(eq(traffic_camera_2), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test data_analytics_node computer deployment")
    void testDataAnalyticsNode() {
        deployment.deployComputers(cps);

        var data_analytics_node = cps.getComputerByName("data_analytics_node");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(PC.class, data_analytics_node, "data_analytics_node should be of type 'PC'"),
                () -> Assertions.assertEquals("192.168.100.4", data_analytics_node.getIp(), "data_analytics_node should have ip '192.168.100.4'")
        );
    }

    @Test
    @DisplayName("Test install software on data_analytics_node")
    void testInstallSoftwareOnDataAnalyticsNode() {
        deployment.deployComputers(cps);

        var data_analytics_node = cps.getComputerByName("data_analytics_node");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(data_analytics_node), eq("YoloV10")),
                () -> verify(cps).installSoftware(eq(data_analytics_node), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test monitoring_laptop computer deployment")
    void testMonitoringLaptop() {
        deployment.deployComputers(cps);

        var monitoring_laptop = cps.getComputerByName("monitoring_laptop");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(Laptop.class, monitoring_laptop, "monitoring_laptop should be of type 'Laptop'"),
                () -> Assertions.assertEquals("192.168.100.5", monitoring_laptop.getIp(), "monitoring_laptop should have ip '192.168.100.5'")
        );
    }

    @Test
    @DisplayName("Test install software on monitoring_laptop")
    void testInstallSoftwareOnMonitoringLaptop() {
        deployment.deployComputers(cps);

        var monitoring_laptop = cps.getComputerByName("monitoring_laptop");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(monitoring_laptop), eq("OpenHAB"))
        );
    }

    @Test
    @DisplayName("Test computer connections")
    void testConnections() {
        deployment.deployComputers(cps);

        var traffic_camera_1 = cps.getComputerByName("traffic_camera_1");
        var traffic_camera_2 = cps.getComputerByName("traffic_camera_2");
        var data_analytics_node = cps.getComputerByName("data_analytics_node");
        var central_hub = cps.getComputerByName("central_hub");
        var monitoring_laptop = cps.getComputerByName("monitoring_laptop");

        Assertions.assertAll(
                () -> Assertions.assertEquals(4, cps.getNumberOfConnections(), "Deployment should make exactly 4 connection pairs!"),
                () -> Assertions.assertTrue(cps.hasConnection(traffic_camera_1, central_hub), "Missing connection: (traffic_camera_1, central_hub)"),
                () -> Assertions.assertTrue(cps.hasConnection(traffic_camera_2, central_hub), "Missing connection: (traffic_camera_2, central_hub)"),
                () -> Assertions.assertTrue(cps.hasConnection(central_hub, data_analytics_node), "Missing connection: (central_hub, data_analytics_node)"),
                () -> Assertions.assertTrue(cps.hasConnection(data_analytics_node, monitoring_laptop), "Missing connection: (data_analytics_node, monitoring_laptop)")
        );
    }

}

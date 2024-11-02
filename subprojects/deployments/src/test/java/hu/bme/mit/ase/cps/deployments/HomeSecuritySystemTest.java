package hu.bme.mit.ase.cps.deployments;

import hu.bme.mit.ase.cps.types.computers.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mockito;

import static org.mockito.Mockito.*;

public class HomeSecuritySystemTest {

    private CPS cps;
    private HomeSecuritySystem deployment;

    @BeforeEach
    void setUp() {
        cps = Mockito.spy(CPS.class);
        deployment = new HomeSecuritySystem();
    }

    @Test
    @DisplayName("HomeSecuritySystem should have correct name")
    void testName() {
        Assertions.assertEquals("HomeSecuritySystem", deployment.getName());
    }

    @Test
    @DisplayName("Test computer deployment")
    void testDeployComputers() {
        deployment.deployComputers(cps);

        var size = cps.getDeployedComputers().size();
        var camera_node_1 = cps.getComputerByName("camera_node_1");
        var central_server = cps.getComputerByName("central_server");

        Assertions.assertAll(
                () -> Assertions.assertEquals(2, size, "There should be exactly 2 deployed computers."),
                () -> Assertions.assertNotNull(camera_node_1, "Missing computer with name 'camera_node_1'"),
                () -> Assertions.assertNotNull(central_server, "Missing computer with name 'central_server'")
        );
    }

    @Test
    @DisplayName("Test camera_node_1 computer deployment")
    void testCameraNode1() {
        deployment.deployComputers(cps);

        var camera_node_1 = cps.getComputerByName("camera_node_1");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(RaspberryPi4.class, camera_node_1, "camera_node_1 should be of type 'RaspberryPi4'"),
                () -> Assertions.assertEquals("192.168.1.10", camera_node_1.getIp(), "camera_node_1 should have ip '192.168.1.10'")
        );
    }

    @Test
    @DisplayName("Test install software on camera_node_1")
    void testInstallSoftwareOnCameraNode1() {
        deployment.deployComputers(cps);

        var camera_node_1 = cps.getComputerByName("camera_node_1");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(camera_node_1), eq("YoloV8")),
                () -> verify(cps).installSoftware(eq(camera_node_1), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test central_server computer deployment")
    void testCentralServer() {
        deployment.deployComputers(cps);

        var central_server = cps.getComputerByName("central_server");

        Assertions.assertAll(
                () -> Assertions.assertInstanceOf(Server.class, central_server, "central_server should be of type 'Server'"),
                () -> Assertions.assertEquals("192.168.1.20", central_server.getIp(), "camera_node_1 should have ip '192.168.1.20'")
        );
    }

    @Test
    @DisplayName("Test install software on central_server")
    void testInstallSoftwareOnCentralServer() {
        deployment.deployComputers(cps);

        var central_server = cps.getComputerByName("central_server");

        Assertions.assertAll(
                () -> verify(cps).installSoftware(eq(central_server), eq("OpenHAB")),
                () -> verify(cps).installSoftware(eq(central_server), eq("YoloV10")),
                () -> verify(cps).installSoftware(eq(central_server), eq("OpenCV"))
        );
    }

    @Test
    @DisplayName("Test computer connections")
    void testConnections() {
        deployment.deployComputers(cps);

        var camera_node_1 = cps.getComputerByName("camera_node_1");
        var central_server = cps.getComputerByName("central_server");

        Assertions.assertAll(
                () -> Assertions.assertEquals(1, cps.getNumberOfConnections(), "Deployment should make exactly 1 connection pair!"),
                () -> Assertions.assertTrue(cps.hasConnection(camera_node_1, central_server), "Missing connection: (camera_node_1, central_server)")
        );
    }

    @Test
    @DisplayName("Basic test for checkDeployment")
    void testCheckDeployment() {
        deployment.deployComputers(cps);

        var dummyCps = new CPS();

        Assertions.assertAll(
                () -> Assertions.assertTrue(deployment.checkDeployment(cps), "Deployment should be fine for used CPS"),
                () -> Assertions.assertFalse(deployment.checkDeployment(dummyCps), "Deployment should not be fine for dummy CPS")
        );

    }

}

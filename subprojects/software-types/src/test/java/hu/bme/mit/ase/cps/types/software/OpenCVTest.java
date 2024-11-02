package hu.bme.mit.ase.cps.types.software;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class OpenCVTest {

    @Test
    @DisplayName("OpenCV should return correct name")
    void testOpenCVGetName() {
        var openCV = new OpenCV();
        Assertions.assertEquals("OpenCV", openCV.getName(),
                "Expected OpenCV's getName() to return 'OpenCV'");
    }

    @Test
    @DisplayName("OpenCV should return correct description")
    void testOpenCVGetDescription() {
        var openCV = new OpenCV();
        Assertions.assertEquals("Open-source computer vision library", openCV.getDescription(),
                "Expected OpenCV's getDescription() to return 'Open-source computer vision library'");
    }

    @Test
    @DisplayName("OpenCV should return correct port")
    void testOpenCVGetPort() {
        var openCV = new OpenCV();
        Assertions.assertEquals(-1, openCV.getPort(),
                "Expected OpenCV's getPort() to return -1 as no port is specified");
    }

    @Test
    @DisplayName("OpenCV should have no dependencies")
    void testOpenCVGetDependencies() {
        var openCV = new OpenCV();
        Assertions.assertTrue(openCV.getDependencies().isEmpty(),
                "Expected OpenCV to have no dependencies, but some were found");
    }
}

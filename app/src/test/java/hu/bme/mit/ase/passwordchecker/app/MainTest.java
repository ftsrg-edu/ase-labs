/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.app;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class MainTest {
    @Test
    void appRuns() {
        assertDoesNotThrow(() -> Main.main(new String[] {"--password", "Test1234!", "--loglevel", "INFO"}));
        assertDoesNotThrow(() -> Main.main(new String[] {"--password", "12345678", "--loglevel", "ERROR"}));
    }
}

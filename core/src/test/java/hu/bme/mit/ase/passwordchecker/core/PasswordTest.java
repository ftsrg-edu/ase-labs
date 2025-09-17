/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.core;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class PasswordTest {
    @Test
    void wrapsString() {
        Password pw = new Password("secret");
        assertEquals("secret", pw.value());
    }

    @Test
    void hasLength() {
        Password pw = new Password("secret");
        assertEquals(6, pw.length());
    }
}

/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.dictionary;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DictionaryTest {
    @Test
    void detectsWeakPassword() {
        Dictionary dict = new Dictionary("weak-passwords.txt");
        assertTrue(dict.contains("12345678"));
        assertFalse(dict.contains("notInList"));
    }
}


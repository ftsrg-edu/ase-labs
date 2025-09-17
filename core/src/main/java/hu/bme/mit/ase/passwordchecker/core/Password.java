/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.core;

public record Password(String value) {

    public int length() {
        return value.length();
    }
}

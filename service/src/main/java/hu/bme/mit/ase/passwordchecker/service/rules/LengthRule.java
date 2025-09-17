/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.service.rules;

import hu.bme.mit.ase.passwordchecker.core.Password;

public class LengthRule implements Rule {
    private final int minLength;
    private final boolean critical;

    public LengthRule(int minLength, boolean critical) {
        this.minLength = minLength;
        this.critical = critical;
    }

    @Override
    public boolean test(Password password) {
        return password.value().length() >= minLength;
    }

    @Override
    public boolean isCritical() {
        return critical;
    }
}
/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.service.rules;

import hu.bme.mit.ase.passwordchecker.core.Password;
import hu.bme.mit.ase.passwordchecker.dictionary.Dictionary;

public class DictionaryRule implements Rule {
    private final Dictionary dictionary;
    private final boolean critical;

    public DictionaryRule(Dictionary dictionary, boolean critical) {
        this.dictionary = dictionary;
        this.critical = critical;
    }

    @Override
    public boolean test(Password password) {
        return !dictionary.contains(password);
    }

    @Override
    public boolean isCritical() {
        return critical;
    }
}
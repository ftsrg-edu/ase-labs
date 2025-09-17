/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.service;

import hu.bme.mit.ase.passwordchecker.core.Password;
import hu.bme.mit.ase.passwordchecker.core.Strength;
import hu.bme.mit.ase.passwordchecker.dictionary.Dictionary;
import hu.bme.mit.ase.passwordchecker.service.rules.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class PasswordStrengthChecker {
    private static final Logger logger = LoggerFactory.getLogger(PasswordStrengthChecker.class);
    private final List<Rule> rules;

    public PasswordStrengthChecker(List<Rule> rules) {
        this.rules = rules;
    }

    public Strength evaluate(Password password) {
        boolean mediumTriggered = false;
        logger.debug("Checking password: {}", password.value());
        for (Rule rule : rules) {
            boolean passed = rule.test(password);
            logger.info("Rule {}: {}", rule.getClass().getSimpleName(), passed ? "PASSED" : "FAILED");
            if (!passed) {
                if (rule.isCritical()) {
                    logger.error("Critical rule {} failed, returning WEAK", rule.getClass().getSimpleName());
                    return Strength.WEAK;
                } else {
                    logger.warn("Non-critical rule {} failed, continuing to check other rules", rule.getClass().getSimpleName());
                    mediumTriggered = true;
                }
            }
        }
        return mediumTriggered ? Strength.MEDIUM : Strength.STRONG;
    }

    public static PasswordStrengthChecker createDefault() {
        return new PasswordStrengthChecker(List.of(
                new LengthRule(8, true),
                new CharacterVarietyRule(false),
                new DictionaryRule(new Dictionary("weak-passwords.txt"), true)));
    }
}

/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.service;

import hu.bme.mit.ase.passwordchecker.core.Password;
import hu.bme.mit.ase.passwordchecker.service.rules.*;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import hu.bme.mit.ase.passwordchecker.dictionary.Dictionary;

public class RuleTest {
    @Test
    void characterVarietyRuleTest() {
        Rule rule = new CharacterVarietyRule(false);
        
        Password password = new Password("Abc123");
        assertFalse(rule.test(password));

        Password password2 = new Password("Abc123!");
        assertTrue(rule.test(password2));
    }

    @Test
    void dictionaryRuleTest() {
        Dictionary dictionary = mock(Dictionary.class);
        Password password = new Password("12345678");
        Password password2 = new Password("uniquePass123!");
        when(dictionary.contains(password)).thenReturn(true);
        when(dictionary.contains(password2)).thenReturn(false);

        Rule rule = new DictionaryRule(dictionary, true);
        assertFalse(rule.test(password));
        assertTrue(rule.test(password2));
    }

    @Test
    void lengthRuleTest() {
        Rule rule = new LengthRule(8, true);
        
        Password password = new Password("Abc123");
        assertFalse(rule.test(password));

        Password password2 = new Password("Abc12345");
        assertTrue(rule.test(password2));
    }
}

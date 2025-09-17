/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

package hu.bme.mit.ase.passwordchecker.dictionary;

import hu.bme.mit.ase.passwordchecker.core.Password;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

public class Dictionary {
    private static final Logger logger = LoggerFactory.getLogger(Dictionary.class);
    private final Set<String> weakPasswords = new HashSet<>();

    public Dictionary(String resourceName) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(getClass().getClassLoader().getResourceAsStream(resourceName)))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String trimmed = line.trim();
                weakPasswords.add(trimmed);
                logger.debug("Loaded weak password: {}", trimmed);
            }
            logger.info("Loaded {} weak passwords", weakPasswords.size());
        } catch (Exception e) {
            logger.error("Failed to load dictionary: {}", resourceName, e);
            throw new RuntimeException("Failed to load dictionary: " + resourceName, e);
        }
    }

    public boolean contains(String password) {
        return weakPasswords.contains(password);
    }

    public boolean contains(Password password) {
        return contains(password.value());
    }
}


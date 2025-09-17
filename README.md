<!--
  SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
  
  SPDX-License-Identifier: Apache-2.0
-->

# 🔐 Password Strength Checker

A simple **multi-module Gradle project** that evaluates password strength.

---

## 📂 Project Structure
```
password-checker/
├── core/        # Domain objects (Password, Strength)
├── dictionary/  # Loads weak passwords from resources
├── service/     # Password rules and strength checker
└── app/         # CLI application
```

---

## ⚙️ Features

- **Core module**  
  Provides the `Password` value object and `Strength` enum.

- **Dictionary module**  
  Loads weak passwords from a text file (`weak-passwords.txt` in resources).

- **Service module**  
  Contains the `PasswordStrengthChecker` and modular **rules** (`LengthRule`, `CharacterVarietyRule`, `DictionaryRule`): rules may be *critical* (failing → **WEAK**) or *non-critical* (failing → at most **MEDIUM**).

- **App module**  
  Command-line interface using **JCommander**.
  - `--password <password>`: Check the strength of a single password.
  - `--loglevel <level>`: Set logging level (DEBUG, INFO, WARN, ERROR).
  
  Outputs the strength to the console.

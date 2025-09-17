/*
 * SPDX-FileCopyrightText: 2025 Budapest University of Technology and Economics
 *
 * SPDX-License-Identifier: Apache-2.0
 */

dependencyResolutionManagement {
    versionCatalogs {
        create("libs") { // use the same version catalog as the other subprojects
            from(files("../gradle/libs.versions.toml"))
        }
    }
}
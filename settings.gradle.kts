rootProject.name = "password-checker"

include(
    "core",
    "dictionary",
    "service",
    "app"
)

// No versionCatalogs { from(...) } here, we will only use libs.versions.toml once

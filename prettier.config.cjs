/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
    singleQuote: true,
    trailingComma: 'none',
    tabWidth: 4,
    semi: false,
    printWidth: 120,
    plugins: ['prettier-plugin-solidity'],
    overrides: [
        {
            files: '*.sol',
            options: {
                printWidth: 120,
                tabWidth: 4,
                useTabs: true,
                singleQuote: false,
                bracketSpacing: true,
                explicitTypes: 'always'
            }
        }
    ]
}

module.exports = config

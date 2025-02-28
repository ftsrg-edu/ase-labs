import path from 'node:path';
import { fileURLToPath } from 'node:url';

import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/', 'gen/', 'web-dist/', 'node_modules/' ] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.dirname(fileURLToPath(import.meta.url)),
      },
    },
  },
);

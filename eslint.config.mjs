import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js: pluginJs.configs.recommended,
      react: pluginReact.configs.recommended,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:prettier/recommended',
    ],
    env: {
      browser: true,
      node: true,
      es6: true,
      jest: true,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
  },
];

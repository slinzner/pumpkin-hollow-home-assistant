import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    rules: {
      curly: ['error', 'all'],
      'max-statements-per-line': ['error', { max: 1 }],
    },
  },
  {
    files: ['packages/**/*.js'],
    languageOptions: { globals: globals.browser },
    rules: { eqeqeq: 'error', 'no-var': 'error', 'prefer-const': 'error' },
  },
  {
    files: ['scripts/**/*.mjs', 'tests/**/*.mjs', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
];

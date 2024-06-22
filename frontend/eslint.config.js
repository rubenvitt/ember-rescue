// eslint.config.js
import js from '@eslint/js';

export default [
  {
    rules: js.configs.all.rules,
  },
  {
    rules: {
      'no-const-assign': 'warn',
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
    },
  },
];
import js from '@eslint/js';

export default [
  {
    rules: js.configs.all.rules,
  },
  {
    extends: ['prettier', 'plugin:prettier/recommended'],
    rules: {
      'no-const-assign': 'warn',
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'max-len': ['warn', { code: 200 }],
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];

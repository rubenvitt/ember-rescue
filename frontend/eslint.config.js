import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import js from '@eslint/js';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/src-tauri/target/**', '.eslint.config.js'],
  },
  {
    rules: js.configs.all.rules,
  },
  {
    rules: {
      'max-len': ['warn', { code: 200 }],
      'no-const-assign': 'warn',
      'no-undef': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
  eslintPluginPrettierRecommended,
];

import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['build/**/*', 'node_modules/**/*'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
  },
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      'array-bracket-spacing': ['error', 'never'],
      'arrow-spacing': 'error',
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['warn', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-style': ['error', 'last', { exceptions: { VariableDeclaration: true } }],
      'computed-property-spacing': ['error', 'never'],
      'curly': ['warn', 'multi-line'],
      'eqeqeq': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'keyword-spacing': 'warn',
      'linebreak-style': ['error', 'unix'],
      'no-console': 'warn',
      'no-mixed-spaces-and-tabs': 'error',
      'no-multiple-empty-lines': ['warn', { max: 2, maxBOF: 0, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'quotes': ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'require-atomic-updates': 'off',
      'semi': ['warn', 'always'],
      'space-before-blocks': 'warn',
      'space-before-function-paren': ['warn', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
      'space-infix-ops': 'warn',
      'space-unary-ops': ['warn', { words: true, nonwords: false }],
    },
    plugins: {
      react: eslintPluginReact,
    },
  },
  eslintPluginPrettierRecommended,
];

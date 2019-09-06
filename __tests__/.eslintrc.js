module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
    'jest/globals': true,
    browser: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json',
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
  ],

  plugins: ['jest', '@typescript-eslint'],

  rules: {
    '@typescript-eslint/require-await': 0,
    '@typescript-eslint/unbound-method': 0,
  },
}

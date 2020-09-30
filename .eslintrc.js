module.exports = {
  root: true,

  env: {
    es2021: true,
    browser: true,
    node: true,
    'shared-node-browser': true,
  },

  globals: {
    BarcodeDetector: 'readonly',
    TextDetector: 'readonly',
    __static: 'readonly',
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],

  // parserOptions: {
  //   ecmaVersion: 2020,
  // },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    'prettier/prettier': 'error',
    semi: ['error', 'never'],
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
    // {
    //   env: {
    //     browser: false,
    //   },
    //   files: ['src/utilities/**/*.{j,t}s?(x)'],
    // },
    {
      env: {
        worker: true,
      },
      files: ['src/utilities/workers/**/*.{j,t}s?(x)'],
    },
  ],
}

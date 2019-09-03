module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
    'jest/globals': true,
  },

  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },

  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],

  plugins: ['jest'],

  rules: {},
}

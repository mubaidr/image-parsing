module.exports = {
  env: {
    node: true,
    es6: true,
  },

  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    extraFileExtensions: ['.js', '.vue'],
  },

  extends: ['eslint:recommended', 'prettier'],

  plugins: [],

  rules: {},
}

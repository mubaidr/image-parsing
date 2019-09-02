module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },

  parser: 'vue-eslint-parser',

  parserOptions: {
    // parser: 'babel-eslint',
    ecmaVersion: 2019,
    sourceType: 'module',
    extraFileExtensions: ['.js', '.vue'],
  },

  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],

  plugins: ['vue'],

  rules: {},
}

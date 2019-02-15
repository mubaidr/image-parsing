module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 8,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],
  globals: {
    __static: true,
  },
  plugins: ['vue'],
  rules: {
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'linebreak-style': 0,
    'no-console': 0,
    'no-continue': 0,
    'no-underscore-dangle': 0,
    semi: 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', 'prettier'],
  globals: {
    __static: true,
    fabric: true,
    Excel: true,
  },
  plugins: ['vue'],
  rules: {
    semi: 0,
    'no-continue': 0,
    'import/extensions': 0,
    'no-underscore-dangle': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'linebreak-style': 0,
    // allow debugger during development
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}

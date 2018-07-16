module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
  },
  env: {
    browser: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:vue/recommended', 'prettier'],
  globals: {
    __static: true,
  },
  plugins: ['vue'],
  rules: {
    semi: 0,
    'linebreak-style': 0,
    'no-continue': 0,
    // allow debugger during development
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
}

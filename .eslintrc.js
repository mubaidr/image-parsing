module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaVersion: 8
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['airbnb-base', 'plugin:vue/recommended', 'prettier'],
  globals: {
    __static: true,
    fabric: true
  },
  plugins: ['vue'],
  rules: {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'no-multi-assign': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'linebreak-style': [2, 'windows'],
    'no-unused-vars': 2,
    'no-await-in-loop': 0,
    'prefer-destructuring': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}

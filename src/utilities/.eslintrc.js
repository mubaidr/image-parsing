module.exports = {
  env: {
    node: true,
  },

  parser: '@typescript-eslint/parser',

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './tsconfig.json',
    extraFileExtensions: ['.js', '.vue'],
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
  ],

  plugins: ['@typescript-eslint'],

  rules: {},
}

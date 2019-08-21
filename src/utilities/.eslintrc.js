module.exports = {
  // https://eslint.org/docs/user-guide/configuring#using-configuration-files-1
  root: true,

  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    node: true,
  },

  // https://eslint.org/docs/user-guide/configuring#specifying-parser
  parser: '@typescript-eslint/parser',
  // https://vuejs.github.io/eslint-plugin-vue/user-guide/#faq
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },

  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  // order matters: from least important to most important in terms of overriding
  // Prettier + Vue: https://medium.com/@gogl.alex/how-to-properly-set-up-eslint-with-prettier-for-vue-or-nuxt-in-vscode-e42532099a9c
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
  ],

  // https://eslint.org/docs/user-guide/configuring#configuring-plugins
  plugins: ['@typescript-eslint'],

  rules: {
    semi: 0,
    'no-console': 0,
    'no-buffer-constructor': 2,
    '@typescript-eslint/no-parameter-properties': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-inferrable-types': 0,
  },
}

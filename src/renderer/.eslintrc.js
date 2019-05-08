module.exports = {
  root: true,

  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    browser: true,
    node: true,
  },

  // https://vuejs.github.io/eslint-plugin-vue/user-guide/#faq
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },

  parser: 'vue-eslint-parser',

  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  // order matters: from least important to most important in terms of overriding
  // Prettier + Vue: https://medium.com/@gogl.alex/how-to-properly-set-up-eslint-with-prettier-for-vue-or-nuxt-in-vscode-e42532099a9c
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'prettier',
    'prettier/vue',
  ],

  // https://eslint.org/docs/user-guide/configuring#configuring-plugins
  plugins: ['vue'],

  rules: {
    'no-console': 0,
    'no-undef': 0,
  },
}

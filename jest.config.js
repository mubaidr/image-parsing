module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  globalSetup: './tests/unit/setup.ts',
  globalTeardown: './tests/unit/teardown.ts',
}

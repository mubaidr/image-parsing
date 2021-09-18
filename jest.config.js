/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: 'node',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '^/@/(.*)$': '<rootDir>/packages/$1',
  },
  // globalSetup: './tests/unit/setup.ts',
  // globalTeardown: './tests/unit/teardown.ts'
};

module.exports = {
  automock: false,
  collectCoverage: false,
  collectCoverageFrom: [
    'src/utilities/**/*.ts',
    '!**/@declarations/**',
    '!**/@enums/**',
    '!**/@interfaces/**',
  ],
  globals: {
    'ts-jest': {
      babelConfig: '.babelrc',
      tsConfig: 'tsconfig.json',
      diagnostics: false,
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'node',
  // testEnvironment: '@zeromake/jest-environment-jsdom-with-canvas',
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js', '__tests__/_test_data/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
}

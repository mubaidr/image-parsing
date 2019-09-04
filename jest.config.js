module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/utilities/**/*.ts',
    '!**/@declarations/**',
    '!**/@enums/**',
    '!**/@interfaces/**',
  ],
  // coverageDirectory: 'coverage',
  // verbose: false,
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: '@zeromake/jest-environment-jsdom-with-canvas',
}

module.exports = {
  bail: 1,
  automock: false,
  collectCoverage: true,
  // collectCoverageFrom: ['src/utilities/**/*.js', '!src/utilities/tmp/'],
  // coverageDirectory: 'coverage',
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
}

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/utilities/**/*.js', '!src/utilities/tmp/'],
  coverageDirectory: 'coverage',
  tansform: {},
  testPathIgnorePatterns: ['__tests__/.eslintrc.js'],
}
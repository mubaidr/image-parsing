module.exports = {
  automock: false,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/utilities/**/*.ts',
    '!**/@declarations/**',
    '!**/@enums/**',
    '!**/@interfaces/**',
  ],
  testPathIgnorePatterns: ['/node_modules/', '.eslintrc.js'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  // transform: {
  //   '^.+\\.[t|j]sx?$': 'babel-jest',
  // },
  setupFiles: ['jest-canvas-mock'],
  preset: 'ts-jest',
  // moduleNameMapper: {
  //   '^@utilities/(.*)$': '<rootDir>/src/utilities/$1',
  // },
  testEnvironment: '@zeromake/jest-environment-jsdom-with-canvas',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
      babelConfig: '.babelrc',
    },
  },
}

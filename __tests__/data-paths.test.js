const path = require('path')
const paths = require('../src/utilities/data-paths')

describe('data-paths', () => {
  test('paths', () => {
    expect(paths.tmp).toBe(path.resolve('.tmp'))
    expect(paths.root).toBe(path.resolve('.'))
    expect(paths.main).toBe(path.resolve('src/main'))
    expect(paths.renderer).toBe(path.resolve('src/renderer'))
    expect(paths.trainingData).toBe(path.resolve('src/data/training-data.json'))
    expect(paths.testData).toBe(path.resolve('__tests__/_test_data'))
    expect(paths.utiltities).toBe(path.resolve('src/utilities'))
    expect(paths.src).toBe(path.resolve('src'))
  })
})

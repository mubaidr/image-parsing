const path = require('path')

const root = path.join(__dirname, '..')

module.exports = {
  root,
  sample: path.join(root, 'data', 'sample'),
  sampleSimple: path.join(root, 'data', 'sampleSimple'),
  test: path.join(root, 'data', 'test'),
  testSimple: path.join(root, 'data', 'testSimple'),
  trainingOutput: path.join(root, 'data', 'output', 'training.json'),
  resultsOutput: path.join(root, 'data', 'output', 'results.json')
}

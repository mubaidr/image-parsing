const path = require('path')

const root = path.join(__dirname, '..')

module.exports = {
  root,
  sample: path.join(root, 'data', 'sample'),
  test: path.join(root, 'data', 'test'),
  trainingOutput: path.join(root, 'data', 'output', 'training.json'),
  resultsOutput: path.join(root, 'data', 'output', 'results.json')
}

const path = require('path')
const os = require('os')

module.exports = {
  main: path.resolve('src/main'),
  renderer: path.resolve('src/renderer'),
  root: path.resolve('.'),
  src: path.resolve('src'),
  testData: path.resolve('__tests__/test-data'),
  tmp: os.tmpdir(),
  home: path.join(os.homedir(), 'desktop'),
  trainingData: path.resolve('src/data/training-data.json'),
  utiltities: path.resolve('src/utilities'),
  DEFAULTS: {
    centreModel: path.resolve('src/data/questions-model.json'),
    design: path.resolve('__tests__/test-data', 'design.svg'),
    images: path.resolve('__tests__/test-data', 'images'),
    key: path.resolve('__tests__/test-data/key', 'key.jpg'),
    postModel: path.resolve('src/data/questions-model.json'),
    questionsModel: path.resolve('src/data/questions-model.json'),
    result: path.resolve('__tests__/test-data', 'result.csv'),
    rollNoModel: path.resolve('src/data/questions-model.json'),
  },
}

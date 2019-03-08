const path = require('path')

// eslint-disable-next-line
const { app } = require('electron').remote || {}

const o = {
  appData: app.getPath('appData'),
  desktop: app.getPath('desktop'),
  main: path.resolve('src/main'),
  renderer: path.resolve('src/renderer'),
  root: path.resolve('.'),
  src: path.resolve('src'),
  testData: path.resolve('__tests__/test-data'),
  tmp: app.getPath('temp'),
  trainingData: path.resolve('src/data/training-data.json'),
  userData: app.getPath('userData'),
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

module.exports = o

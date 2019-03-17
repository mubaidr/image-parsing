const path = require('path')
const os = require('os')

const isDev = process.env.NODE_ENV === 'development'

const tmp = isDev ? path.resolve('.tmp') : os.tmpdir()
const home = isDev ? path.resolve('.') : path.join(os.homedir(), 'desktop')

module.exports = {
  root: path.resolve('.'),
  tmp,
  temp: tmp,
  home,
  questionsModel: path.resolve('src/data/questions-model.json'),
  test: {
    design: path.resolve('__tests__/test-data', 'design.svg'),
    images: path.resolve('__tests__/test-data', 'images'),
    keyImage: path.resolve('__tests__/test-data', 'key.jpg'),
    key: path.resolve('__tests__/test-data', 'key.csv'),
    result: path.resolve('__tests__/test-data', 'result.csv'),
  },
}

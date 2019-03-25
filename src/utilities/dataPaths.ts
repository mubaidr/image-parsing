import os = require('os')
import path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const tmp = isDev ? path.resolve('.tmp') : os.tmpdir()
const home = isDev ? path.resolve('.') : path.join(os.homedir(), 'desktop')

export default {
  home,
  questionsModel: path.resolve('src/data/questions-model.json'),
  root: path.resolve('.'),
  temp: tmp,
  test: {
    design: path.resolve('__tests__/test-data', 'design.qr.svg'),
    designBarcode: path.resolve('__tests__/test-data', 'design.svg'),
    images: path.resolve('__tests__/test-data', 'images-qrcode'),
    imagesBarcode: path.resolve('__tests__/test-data', 'images-barcode'),
    key: path.resolve('__tests__/test-data', 'key.csv'),
    keyImage: path.resolve('__tests__/test-data', 'key.jpg'),
    result: path.resolve('__tests__/test-data', 'result.csv'),
  },
  tmp,
}

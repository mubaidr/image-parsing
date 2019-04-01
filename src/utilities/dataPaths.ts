import os from 'os'
import path from 'path'

const isDev: boolean = process.env.NODE_ENV === 'development'

const tmp: string = isDev ? path.resolve('.tmp') : os.tmpdir()
const home: string = isDev
  ? path.resolve('.')
  : path.join(os.homedir(), 'desktop')

const dataPaths = {
  design: path.resolve('__tests__/test-data', 'design.qr.svg'),
  designBarcode: path.resolve('__tests__/test-data', 'design.svg'),
  home,
  images: path.resolve('__tests__/test-data', 'images-qrcode'),
  imagesBarcode: path.resolve('__tests__/test-data', 'images-barcode'),
  key: path.resolve('__tests__/test-data', 'key.csv'),
  keyImage: path.resolve('__tests__/test-data', 'key.jpg'),
  questionsModel: path.resolve('src/data/questions-model.json'),
  result: path.resolve('__tests__/test-data', 'result.csv'),
  root: path.resolve('.'),
  temp: tmp,
  tmp,
}

export { dataPaths }

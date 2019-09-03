import os from 'os'
import path from 'path'

const isDev: boolean = process.env.NODE_ENV === 'development'

const tmp: string = isDev ? path.resolve('.tmp') : os.tmpdir()
const home: string = path.join(os.homedir(), 'desktop')

const dataPaths = {
  design: path.resolve('_test_data', 'design.qr.svg'),
  designBarcode: path.resolve('_test_data', 'design.svg'),
  home,
  images: path.resolve('_test_data', 'images-qrcode'),
  imagesBarcode: path.resolve('_test_data', 'images-barcode'),
  key: path.resolve('_test_data', 'key.xlsx'),
  keyImage: path.resolve('_test_data', 'key.jpg'),
  questionsModel: path.resolve('src/data/questions-model.json'),
  result: path.resolve('_test_data', 'result.xlsx'),
  root: path.resolve('.'),
  temp: tmp,
  tmp,
}

export { dataPaths }

import os from 'os'
import path from 'path'

const isDev: boolean = process.env.NODE_ENV === 'development'
const tmp: string = isDev ? path.resolve('.tmp') : os.tmpdir()
const home: string = path.join(os.homedir(), 'desktop')

const dataPaths = {
  design: path.resolve('tests', '_data', 'design.qr.svg'),
  designBarcode: path.resolve('tests', '_data', 'design.svg'),
  home,
  images: path.resolve('tests', '_data', 'images-qrcode'),
  imagesBarcode: path.resolve('tests', '_data', 'images-barcode'),
  key: path.resolve('tests', '_data', 'key.xlsx'),
  keyImage: path.resolve('tests', '_data', 'key.jpg'),
  questionsModel: isDev
    ? path.resolve('src/data/questions-model.json')
    : path.resolve('dist/data/questions-model.json'),
  result: path.resolve('tests', '_data', 'result.xlsx'),
  resultCompiled: path.resolve('tests', '_data', 'resultCompiled.xlsx'),
  root: path.resolve('.'),
  temp: tmp,
  tmp,
}

export { dataPaths }

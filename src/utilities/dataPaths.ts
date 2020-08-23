import os from 'os'
import path from 'path'

const isDev: boolean = process.env.NODE_ENV === 'development'
const tmp: string = isDev ? path.resolve('.tmp') : os.tmpdir()
const home: string = path.join(os.homedir(), 'desktop')

const dataPaths = {
  design: path.resolve('__tests__', '_data', 'design.qr.svg'),
  designBarcode: path.resolve('__tests__', '_data', 'design.svg'),
  home,
  images: path.resolve('__tests__', '_data', 'images-qrcode'),
  imagesBarcode: path.resolve('__tests__', '_data', 'images-barcode'),
  key: path.resolve('__tests__', '_data', 'key.xlsx'),
  keyImage: path.resolve('__tests__', '_data', 'key.jpg'),
  questionsModel: isDev
    ? path.resolve('src/data/questions-model.json')
    : path.resolve('dist/data/questions-model.json'),
  result: path.resolve('__tests__', '_data', 'result.xlsx'),
  resultCompiled: path.resolve('__tests__', '_data', 'resultCompiled.xlsx'),
  root: path.resolve('.'),
  temp: tmp,
  tmp,
}

export { dataPaths }

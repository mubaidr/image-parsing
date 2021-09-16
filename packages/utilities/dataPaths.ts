import os from 'os';
import path from 'path';

const tmp = os.tmpdir();

export const DataPaths = {
  design: path.resolve('tests', '_data', 'design.qr.svg'),
  designBarcode: path.resolve('tests', '_data', 'design.svg'),
  home: os.homedir(),
  images: path.resolve('tests', '_data', 'images-qrcode'),
  imagesBarcode: path.resolve('tests', '_data', 'images-barcode'),
  key: path.resolve('tests', '_data', 'key.xlsx'),
  keyImage: path.resolve('tests', '_data', 'key.jpg'),
  result: path.resolve('tests', '_data', 'result.xlsx'),
  resultCompiled: path.resolve('tests', '_data', 'resultCompiled.xlsx'),
  root: path.resolve('.'),
  temp: tmp,
  tmp,
};

const NATIVE_IMAGES = [
  'png',
  'jpg',
  'jpeg',
  'jpe',
  'jfif',
  'gif',
  'bmp',
  'webp',
  'svg',
]
const IMAGES = ['tif', 'tiff', 'dib', ...NATIVE_IMAGES]
const NATIVE_KEYS = ['xlsx', 'xlsm', 'csv', 'xls']
const KEY = [...NATIVE_KEYS, ...IMAGES]

module.exports = {
  IMAGES,
  KEY,
  NATIVE_KEYS,
  NATIVE_IMAGES,
}

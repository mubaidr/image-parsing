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
const KEY = ['xls', 'xlsm', 'xlsx', 'csv', ...IMAGES]

module.exports = {
  IMAGES,
  KEY,
  NATIVE_IMAGES,
}

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
const NATIVE_KEYS = ['xlsx', 'xlsm', 'xls', 'csv']
const KEY = [...NATIVE_KEYS, ...IMAGES]

export const VALIDTYPES = {
  IMAGES,
  KEY,
  NATIVE_IMAGES,
  NATIVE_KEYS,
}

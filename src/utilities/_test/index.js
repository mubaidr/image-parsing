const fastGlob = require('fast-glob')

console.log(
  fastGlob.sync(
    ['D:/Current/image-parsing/__tests__/test-data/images-barcode/*.{jpg,tif}'],
    { onlyFiles: true }
  )
)

const javascriptBarcodeReader = require('javascript-barcode-reader')
const fastGlob = require('fast-glob')
const path = require('path')
const uuid = require('uuid')
const sharp = require('sharp')

const { IMAGES, NATIVE_IMAGES } = require('./valid-types')
const dataPaths = require('./data-paths')

async function convertImage(src) {
  const isSupported = NATIVE_IMAGES.includes(src.split('.').pop())

  if (isSupported) return src

  const newUrl = path.join(dataPaths.tmp, `${uuid()}.jpg`)

  await sharp(src)
    .jpeg()
    .toFile(newUrl)

  return newUrl
}

/**
 * Return a list of valid image format files from the provided path
 *
 * @param {String} path Path to sarch for images
 * @param {Array.<String>} format Array of extensions of valid image formats
 * @returns {Array.<String>} List of file paths
 */
function getImagePaths(dir) {
  return fastGlob(`${dir}/*.{${IMAGES.join(',')}}`, { onlyFiles: true })
}

/**
 *
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {String} path Path of scanned image file
 * @returns {Object} Roll Number
 */
async function getRollNoFromImage(designData, img) {
  const obj = {
    id: uuid(),
  }
  const metadata = await img.metadata()
  const rollNoPos = designData.rollNo
  const ratio = metadata.width / designData.width
  const width = Math.ceil((rollNoPos.x2 - rollNoPos.x1) * ratio)
  const height = Math.ceil((rollNoPos.y2 - rollNoPos.y1) * ratio)

  const data = await img
    .extract({
      left: Math.floor(rollNoPos.x1 * ratio),
      top: Math.floor(rollNoPos.y1 * ratio),
      width,
      height,
    })
    .toBuffer()

  try {
    obj.rollNo = await javascriptBarcodeReader(
      { data, width, height },
      { barcode: 'code-39' }
    )
  } catch (err) {
    obj.rollNo = null
  }

  return obj
}

/**
 * Logs provided image data to .tmp folder
 * @param {sharp} img Sharp instance
 * @param {String} name Name of file
 */
function logImageData(img, name) {
  img
    .clone()
    .jpeg()
    .toFile(path.join(dataPaths.tmp, `${name || uuid()}.jpeg`), err => {
      if (err) console.log(err)
    })
}

module.exports = {
  convertImage,
  getImagePaths,
  logImageData,
  getRollNoFromImage,
}

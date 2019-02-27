const sharp = require('sharp')

const { convertToBitArray } = require('./index')
// const { logImageData } = require('./images')

/**
 *  Extracts questions data from provided Sharp Image and design data
 *
 * @param {Object} design A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {sharp} img Path of scanned image file
 * @param {Object=} results Path to csv file for training data
 * @param {Number=} rollNumber Roll no of the current scanned image
 * @returns {Object} {title: {String}, data: {buffer}}
 */
async function getQuestionsData(design, img, results, rollNumber) {
  const SCALE = 0.5
  const META = await img.metadata()
  const TARGET_SIZE = design.width * SCALE
  const IS_TRAINING_DATA = results && rollNumber

  // resize if image is larger than design
  img.resize({
    fit: sharp.fit.inside,
    kernel: sharp.kernel.nearest,
    width: TARGET_SIZE,
  })

  const data = []
  const questions = Object.entries(design.questions)

  for (let i = 0; i < questions.length; i += 1) {
    const [title, q] = questions[i]

    const opt = {
      left: Math.floor(q.x1 * SCALE),
      top: Math.floor(q.y1 * SCALE),
      width: Math.ceil((q.x2 - q.x1) * SCALE),
      height: Math.ceil((q.y2 - q.y1) * SCALE * 1.5),
    }
    img.extract(opt)

    // debug
    // logImageData(img, `${title}`)

    // debug
    // logImageData(img, `${rollNumber}-${title}`)

    const buffer = await img.toBuffer()
    const binaryData = convertToBitArray(buffer, META.channels)

    if (IS_TRAINING_DATA) {
      // for training data
      if (results[rollNumber] && results[rollNumber][title] !== '*') {
        data.push({
          input: binaryData,
          output: { [results[rollNumber][title]]: 1 },
        })
      }
    } else {
      // for processing data
      data.push({ title, data: binaryData })
    }
  }

  return data
}

module.exports = {
  getQuestionsData,
}

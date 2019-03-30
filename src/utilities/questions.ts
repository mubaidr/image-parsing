const sharp = require('sharp')

const { convertToBitArray } = require('./index')
// const { imageDataToBinary} = require('./gpu')

// const { logImageData } = require('./images')

/**
 *  Extracts questions data from provided Sharp Image and design data
 *
 * @param {Object} design A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {sharp} img Path of scanned image file
 * @param {Object=} results for training data preparation
 * @returns {Object} {title: {String}, data: {buffer}}
 */
async function getQuestionsData(design, img, results) {
  console.time('Questions')

  const SCALE = 0.5
  const TARGET_SIZE = design.width * SCALE

  // resize if image is larger than design
  img.resize({
    fit: sharp.fit.inside,
    kernel: sharp.kernel.nearest,
    width: TARGET_SIZE,
  })

  const extractedData = []
  const questions = Object.entries(design.questions)

  for (let i = 0; i < questions.length; i += 1) {
    const [title, q] = questions[i]

    img.extract({
      left: Math.floor(q.x1 * SCALE),
      top: Math.floor(q.y1 * SCALE),
      width: Math.ceil((q.x2 - q.x1) * SCALE),
      height: Math.ceil((q.y2 - q.y1) * SCALE),
    })

    // TODO: check GPU version is faster if no resize is performed

    const { data, info } = await img.toBuffer({ resolveWithObject: true })
    const binaryData = convertToBitArray(data, info.channels)

    if (results && results[title] !== '*') {
      // for training data
      extractedData.push({
        input: binaryData,
        output: { [results[title]]: 1 },
      })

      continue
    }

    extractedData.push({ title, data: binaryData })

    // debug
    // logImageData(img, `${title}`)
  }

  console.timeEnd('Questions')

  return extractedData
}

module.exports = {
  getQuestionsData,
}

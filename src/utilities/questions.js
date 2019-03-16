const sharp = require('sharp')

const { convertToBitArray } = require('./index')
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
  const SCALE = 0.5
  const META = await img.metadata()
  const TARGET_SIZE = design.width * SCALE

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

    const binaryData = convertToBitArray(await img.toBuffer(), META.channels)

    if (results && results[title] !== '*') {
      // for training data
      data.push({
        input: binaryData,
        output: { [results[title]]: 1 },
      })
    } else {
      data.push({ title, data: binaryData })
    }

    // debug
    // logImageData(img, `${title}`)
  }

  return data
}

module.exports = {
  getQuestionsData,
}

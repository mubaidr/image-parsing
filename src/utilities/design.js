const cheerio = require('cheerio')
const fs = require('fs')

const OPTIONS = require('./question-options')

/**
 * Extracts position & dimensions of objects from SVG design File
 *
 * @param {String} designFilePath Path to the svg design file
 * @returns {Object} JSON object
 */
async function getDesignData(dir) {
  const designData = {
    questions: {},
  }
  const ROLL_NO_PATTERN = new RegExp(/rollnobarcode/gi)
  const QUESTION_PATTERN = new RegExp(/(q[1-9][0-9]?[ad])\b/gi)

  const $ = cheerio.load(fs.readFileSync(dir, 'utf8'))
  const svgViewBox = $('svg')[0].attribs.viewBox.split(' ')

  designData.width = Math.ceil(svgViewBox[2] - svgViewBox[0])
  designData.height = Math.ceil(svgViewBox[3] - svgViewBox[1])

  let gotRollNo = false
  let x
  let y
  let rx
  let ry
  let width
  let height
  let left
  let top

  const groups = $('g')
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]

    const title =
      $(group)
        .find('title')
        .first()
        .html()
        .trim()
        .toUpperCase() || ''

    if (!title) continue

    const isQuestionGroup = QUESTION_PATTERN.test(title)
    const isRollNoGroup =
      isQuestionGroup || gotRollNo ? false : ROLL_NO_PATTERN.test(title)

    if (!(isQuestionGroup || isRollNoGroup)) continue

    const transform = $(group)
      .attr('transform')
      .replace(/(translate)|\(|\)/gi, '')
      .split(',')
      .map(val => parseInt(val, 10) || 0)

    const rect = $(group)
      .find('rect')
      .first()

    left = parseInt(rect.attr('x'), 10) || 0
    top = parseInt(rect.attr('y'), 10) || 0

    rx = parseInt(rect.attr('rx'), 10) || 0
    ry = parseInt(rect.attr('ry'), 10) || 0

    x = left - rx + transform[0]
    y = top - ry + transform[1]

    width = parseInt(rect.attr('width'), 10) || 0 + rx
    height = parseInt(rect.attr('height'), 10) || 0 + ry

    if (isQuestionGroup) {
      const optionTitle = title.slice(-1)
      const questionNumber = title.slice(0, -1)

      if (!designData.questions[questionNumber]) {
        designData.questions[questionNumber] = {}
      }

      if (optionTitle === OPTIONS.A) {
        designData.questions[questionNumber].x1 = x - 1
        designData.questions[questionNumber].y1 = y - 1
      } else {
        // donot check last option to suport any number of options
        designData.questions[questionNumber].x2 = x + width + 1
        designData.questions[questionNumber].y2 = y + height + 1
      }
    } else if (isRollNoGroup) {
      designData.rollNo = { x1: x, y1: y, x2: x + width, y2: y + height }
      gotRollNo = true
    }
  }

  return designData
}

module.exports = {
  getDesignData,
}

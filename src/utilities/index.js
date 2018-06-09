const brain = require('brain.js')
const cheerio = require('cheerio')
const fastGlob = require('fast-glob')
const fs = require('fs')
const quagga = require('quagga').default
const sharp = require('sharp')

/**
 * Extracts position & dimensions of objects from SVG design File
 * @param {String} designFilePath Path to the svg design file
 * @returns {Object} JSON object
 */
async function getDesignData(path) {
  const designData = {
    questions: {},
  }
  const ROLL_NO_PATTERN = new RegExp(/rollnobarcode/gi)
  const QUESTION_PATTERN = new RegExp(/(q[1-9][0-9]?[ad])\b/gi)

  const $ = cheerio.load(fs.readFileSync(path, 'utf8'))
  const svgViewBox = $('svg')[0].attribs.viewBox.split(' ')

  designData.width = Math.ceil(svgViewBox[2] - svgViewBox[0])
  designData.height = Math.ceil(svgViewBox[3] - svgViewBox[1])

  let gotRollNo = false
  let x
  let y
  let width
  let height

  const groups = $('g')
  for (let i = 0; i < groups.length; i += 1) {
    const group = groups[i]

    const title = $(group)
      .find('title')
      .first()
      .html()
      .trim()
      .toLowerCase()

    const isQuestionGroup = QUESTION_PATTERN.test(title)
    const isRollNoGroup =
      isQuestionGroup || gotRollNo ? false : ROLL_NO_PATTERN.test(title)

    if (isQuestionGroup || isRollNoGroup) {
      const rect = $(group)
        .find('rect')
        .first()

      const transform = $(group)
        .attr('transform')
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')

      x = parseInt(rect.attr('x'), 10) + parseInt(transform[0] || 0, 10)
      y = parseInt(rect.attr('y'), 10) + parseInt(transform[1] || 0, 10)

      width = parseInt(rect.attr('width'), 10)
      height = parseInt(rect.attr('height'), 10)
    }

    if (isQuestionGroup) {
      const optionTitle = title.slice(-1)
      const questionNumber = title.slice(0, -1)

      if (!designData.questions[questionNumber]) {
        designData.questions[questionNumber] = {}
      }

      if (optionTitle === 'a') {
        designData.questions[questionNumber].x1 = x
        designData.questions[questionNumber].y1 = y
      } else {
        designData.questions[questionNumber].x2 = x + width
        designData.questions[questionNumber].y2 = y + height
      }
    }

    if (isRollNoGroup) {
      designData.rollNo = { x1: x, y1: y, x2: x + width, y2: y + height }
      gotRollNo = true
    }
  }

  return designData
}

/**
 * Return a list of valid image format files from the provided path
 * @param {String} path Path to sarch for images
 * @param {Array.<String>} format Array of extensions of valid image formats
 * @returns {Array.<String>} List of file paths
 */
function getImagePaths(path) {
  const format = [
    'png',
    'jpg',
    'jpeg',
    'jpe',
    // 'jfif',
    'gif',
    'tif',
    'tiff',
    'bmp',
    // 'dib',
  ]

  return fastGlob(`${path}/*.{${format.join(',')}}`, {
    onlyFiles: true,
  })
}

/**
 * Returns a trained neural network function
 * @returns {Function} Neural network function
 */
function getNeuralNet(path) {
  const net = new brain.NeuralNetwork()
  const trainingData = JSON.parse(fs.readFileSync(path))
  return net.fromJSON(trainingData)
}

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {String} path Path of scanned image file
 * @returns {Object} {title: {String}, data: {buffer}}
 */
async function getQuestionsData(designData, path) {
  return new Promise((resolveCol, rejectCol) => {
    const promises = []

    const img = sharp(path)
      .resize(designData.width)
      .max()
      .raw()
      .toColourspace('b-w')
      .threshold(32)

    // extract all questions portions
    Object.keys(designData.questions).forEach(title => {
      const p = new Promise(resolve => {
        const q = designData.questions[title]

        img
          .extract({
            left: q.x1 - 10,
            top: q.y1 - 10,
            width: q.x2 - q.x1 + 10,
            height: q.y2 - q.y1 + 10,
          })
          .toBuffer()
          .then(buff => {
            const { data } = buff.toJSON()
            // data.map(val => (val === 0 ? 1 : 0))
            resolve({
              title,
              data,
            })
          })
      })

      promises.push(p)
    })

    Promise.all(promises)
      .then(res => {
        resolveCol(res)
      })
      .catch(err => {
        rejectCol(err)
      })
  })
}

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {String} path Path of scanned image file
 * @returns {Number} Roll Number
 */
async function getRollNoFromImage(designData, path) {
  const img = sharp(path).png()
  const rollNoPos = designData.rollNo

  // extract meta data
  const metadata = await img.metadata()
  const ratio = metadata.width / designData.width

  return new Promise((resolve, reject) => {
    // prepre buffer for barcode scanner
    img
      .extract({
        left: Math.ceil(rollNoPos.x1 * ratio),
        top: Math.ceil(rollNoPos.y1 * ratio),
        width: Math.ceil((rollNoPos.x2 - rollNoPos.x1) * ratio),
        height: Math.ceil((rollNoPos.y2 - rollNoPos.y1) * ratio),
      })
      .toBuffer()
      .then(buff => {
        quagga.decodeSingle(
          {
            decoder: {
              multiple: false,
              readers: ['code_39_reader'],
            },
            locate: false,
            locator: {
              halfSample: true,
              patchSize: 'medium',
            },
            numOfWorkers: 0,
            src: `data:image/png;base64,${buff.toString('base64')}`,
          },
          result => {
            if (result.codeResult) {
              resolve(result.codeResult.code)
            } else {
              reject(new Error('Unable to read barcode'))
            }
          }
        )
      })
  })
}

/**
 *
 * @param {String} path CSV file path
 * @returns {Object} JSON Object
 */
async function readCsvToJson(path) {
  const resultData = {}
  const resultFile = fs.readFileSync(path, 'utf8')

  const rows = resultFile.split('\n')
  const headerValues = rows[0]
    .split(',')
    .map(word => word.replace(/(\s)|(\.)|(-)|(_)/gi, '').toLowerCase())

  const rollNoIndex =
    headerValues.indexOf('rollno') ||
    headerValues.indexOf('rollnumber') ||
    headerValues.indexOf('roll#')

  for (let i = 1; i < rows.length; i += 1) {
    const values = rows[i].split(',').map(word => word.toLowerCase())
    const obj = {}

    for (let j = 0; j < values.length; j += 1) {
      obj[headerValues[j]] = values[j]
    }

    resultData[values[rollNoIndex]] = obj
  }

  return resultData
}

/**
 *
 * @param {String} path JSON file path
 * @returns {Object} CSV String
 */
function readJsonToCsv(obj) {
  let header = ''
  let csv = ''

  const keys = Object.keys(obj)

  // Prepare header row
  Object.keys(obj[keys[0]]).forEach(prop => {
    header += `${prop[0].toUpperCase() + prop.substr(1)},`
  })
  header += 'RollNo'

  // prepare data rows
  keys.forEach(key => {
    Object.keys(obj[key]).forEach(prop => {
      csv += `${obj[key][prop]},`
    })
    csv += key
    csv += '\n'
  })

  return `${header}\n${csv}`
}

module.exports = {
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getRollNoFromImage,
  readCsvToJson,
  readJsonToCsv,
  getQuestionsData,
}

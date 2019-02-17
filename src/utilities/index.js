const brain = require('brain.js')
const cheerio = require('cheerio')
const childProcess = require('child_process')
const csvtojson = require('csvtojson')
const fastGlob = require('fast-glob')
const fs = require('fs')
const javascriptBarcodeReader = require('javascript-barcode-reader')
const NO_OF_CORES = require('physical-cpu-count')
const os = require('os')
const path = require('path')
const sharp = require('sharp')
const dataPaths = require('./data-paths')

/**
 * Create worker processes equal to cpu cores count
 * @param {Number} imagesCount Minimum number of images in the current set
 * @returns {Array} array of child process forks
 */
async function createWorkerProcesses(imagesCount) {
  const WORKERS = []

  const availMemory = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)
  let CORE_COUNT = Math.min(NO_OF_CORES, imagesCount || Infinity)

  // If available ram is less than 100MB/200MB, use only one/two worker processes respectively
  if (availMemory < 0.1) {
    CORE_COUNT = 1
  } else if (availMemory < 0.2) {
    CORE_COUNT = 2
  }

  for (let i = 0; i < CORE_COUNT; i += 1) {
    WORKERS.push(
      childProcess.fork(`${__dirname}/processTaskWorker.js`, [], {
        silent: true,
      })
    )
  }

  return WORKERS
}

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

    const title = (
      $(group)
        .find('title')
        .first()
        .html() || ''
    )
      .trim()
      .toLowerCase()

    if (!title) continue

    const isQuestionGroup = QUESTION_PATTERN.test(title)
    const isRollNoGroup =
      isQuestionGroup || gotRollNo ? false : ROLL_NO_PATTERN.test(title)

    if (!(isQuestionGroup || isRollNoGroup)) continue

    const transform = $(group)
      .attr('transform')
      .replace(/(translate)|\(|\)/gi, '')
      .split(',')
      .map(val => parseFloat(val) || 0)

    const rect = $(group)
      .find('rect')
      .first()

    left = parseFloat(rect.attr('x') || 0)
    top = parseFloat(rect.attr('y') || 0)

    rx = parseFloat(rect.attr('rx') || 0)
    ry = parseFloat(rect.attr('ry') || 0)

    x = left - rx + transform[0]
    y = top - ry + transform[1]

    width = parseFloat(rect.attr('width') || 0) + rx
    height = parseFloat(rect.attr('height') || 0) + ry

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
 *
 * @param {String} path Path to sarch for images
 * @param {Array.<String>} format Array of extensions of valid image formats
 * @returns {Array.<String>} List of file paths
 */
function getImagePaths(dir) {
  const formats = [
    'png',
    'jpg',
    'jpeg',
    'jpe',
    'jfif',
    'gif',
    'tif',
    'tiff',
    'bmp',
    'dib',
  ]

  return fastGlob(`${dir}/*.{${formats.join(',')}}`, { onlyFiles: true })
}

/**
 * Returns a trained neural network function
 *
 * @returns {Function} Neural network function
 */
function getNeuralNet(src) {
  const net = new brain.NeuralNetwork()

  return net.fromJSON(
    JSON.parse(fs.readFileSync(src || dataPaths.trainingData))
  )
}

/**
 * Logs provided image data to .tmp folder
 * @param {sharp} img Sharp instance
 * @param {String} name Name of file
 */
// eslint-disable-next-line
function logImageData(img, name) {
  img.png().toFile(path.join(dataPaths.tmp, `${name}.png`), err => {
    if (err) console.log(err)
  })
}

/**
 * Converts provided Raw image data to Bit array
 * @param {RawImage} data Raw image pixel data array
 * @param {Number} channels Number of channels in the data
 */
function convertToBitArray(data, channels) {
  // convert image data to binary
  const binaryData = []

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const avg = Math.ceil((r + g + b) / 3)
    const threshold = 15
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= 80) {
      // black pixel
      binaryData.push(0)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      (g <= upperLimit && g >= lowerLimit) &&
      (b <= upperLimit && b >= lowerLimit)
    ) {
      // grey pixel
      binaryData.push(1)
    } else {
      // color pixel
      binaryData.push(0)
    }
  }

  return binaryData
}

/**
 *  Extracts questions data from provided Sharp Image and design data
 *
 * @param {Object} design A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {sharp} img Path of scanned image file
 * @param {Object=} results Path to csv file for training data
 * @param {Number=} rollNumber Roll no of the current scanned image
 * @returns {Object} {title: {String}, data: {buffer}}
 */
function getQuestionsData(design, img, results, rollNumber) {
  const SCALE = 0.25
  const IS_TRAINING_DATA = results && rollNumber

  img.resize({
    fit: sharp.fit.inside,
    kernel: sharp.kernel.nearest,
    width: design.width * SCALE,
  })

  // return logImageData(img, 'test')

  const promises = []

  // extract all questions portions
  Object.entries(design.questions).forEach(([title, q]) => {
    const promise = new Promise(resolve => {
      img
        .extract({
          left: Math.floor(q.x1 * SCALE),
          top: Math.floor(q.y1 * SCALE),
          width: Math.ceil((q.x2 - q.x1) * SCALE),
          height: Math.ceil((q.y2 - q.y1) * SCALE),
        })
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
          const binaryData = convertToBitArray(data, info.channels)

          if (IS_TRAINING_DATA) {
            // for training data
            if (results[rollNumber] && results[rollNumber][title] !== '*') {
              resolve({
                input: binaryData,
                output: { [results[rollNumber][title]]: 1 },
              })
            } else {
              resolve(false)
            }
          } else {
            // for processing data
            resolve({ title, data: binaryData })
          }
        })
    })

    promises.push(promise)
  })

  return Promise.all(promises)
}

/**
 *
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {String} path Path of scanned image file
 * @returns {String} Roll Number
 */
async function getRollNoFromImage(designData, img) {
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

  return javascriptBarcodeReader(
    { data, width, height },
    { barcode: 'code-39' }
  )
}

/**
 *
 *
 * @param {String} str JSON object or JSON file path
 * @param {Boolean} isPath True for path
 * @param {Boolean} isKey True if the CSV file is answer key file
 * @returns {Object} CSV String
 */
async function CSVToJSON(str, isPath, isKey) {
  const csv = csvtojson()
  let obj
  let arr

  if (isPath) {
    arr = await csv.fromFile(str)
  } else {
    arr = await csv.fromString(str)
  }

  if (isKey) {
    obj = arr[0]
  } else {
    obj = {}

    arr.forEach(item => {
      obj[item.RollNo] = item
    })
  }

  return obj
}

/**
 *
 *
 * @param {String} str JSON object or JSON file path
 * @param {Boolean} isPath True for path
 * @returns {Object} CSV String
 */
function JSONToCSV(str, isPath) {
  const obj = isPath ? JSON.parse(fs.readFileSync(str, 'utf8')) : str

  let header = 'ROLL NO'
  let csv = ''

  // sort by roll number
  obj.sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])

  // parse to csv
  Object.values(obj).forEach((val, index) => {
    const [[rollno, keys]] = Object.entries(val)

    // eslint-disable-next-line
    csv += '\n'
    csv += rollno

    // sort by question no
    const keyEntries = Object.entries(keys).sort(
      (a, b) => a[0].replace('q', '') - b[0].replace('q', '')
    )

    // append to csv
    for (let i = 0; i < keyEntries.length; i += 1) {
      if (i !== keyEntries.length) {
        csv += ','
      }

      csv += keyEntries[i][1].toUpperCase
        ? keyEntries[i][1].toUpperCase()
        : keyEntries[i][1]

      if (index === 0) {
        header += `,${keyEntries[i][0].toUpperCase()}`
      }
    }
  })

  return `${header}${csv}`
}

/**
 * Exports result data
 *
 * @param {Object} resultData Result data JSON format
 * @param {String} name Name of the output file
 * @param {Boolean} isCSV if the provided data is CSV
 */
async function exportResult(resultData, name, isCSV) {
  const csv = isCSV ? resultData : await JSONToCSV(resultData)

  try {
    // TODO: implement download
    alert('implement download')
  } catch (error) {
    console.log('output: ', csv)
  }
}

/**
 * Compare the provided result with key to generate marks
 *
 * @param {Object} keys JSON Object containing answer keys
 * @param {Object} result JSON Object containing result keys
 * @param {Number} correctMarks Number of marks to assign per correct answer
 * @param {Number} negativeMarks Number of marks to deduct per correct answer
 * @returns {Number} Total marks obtained
 */
async function compileResult(keys, results, correctMarks, negativeMarks) {
  const keyEntries = Object.entries(keys.key)
  const output = []
  let totalMarks = 0

  for (let i = 0; i < keyEntries.length; i += 1) {
    const [, value] = keyEntries[i]

    if (value === '?' || value === '*') continue

    totalMarks += correctMarks
  }

  Object.entries(results).forEach(([rollNo, answers]) => {
    let marks = 0

    for (let i = 0; i < keyEntries.length; i += 1) {
      const [key, value] = keyEntries[i]

      // if user has not selected any option
      if (value === '?') continue

      // if question has multiple correct options
      if (value === '*') continue

      // if question has no right option
      if (answers[key] === '?') continue

      if (answers[key] === value) {
        // correct option
        marks += correctMarks
      } else {
        // in-correct option
        marks -= negativeMarks
      }
    }

    output.push({
      [rollNo]: {
        marks,
        totalMarks,
      },
    })
  })

  // export
  exportResult(await JSONToCSV(output), 'ResultMarks', true)
}

module.exports = {
  createWorkerProcesses,
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getRollNoFromImage,
  CSVToJSON,
  JSONToCSV,
  getQuestionsData,
  exportResult,
  compileResult,
}

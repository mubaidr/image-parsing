const childProcess = require('child_process')
const brain = require('brain.js')
const cheerio = require('cheerio')
const fastGlob = require('fast-glob')
const fs = require('fs')
const javascriptBarcodeReader = require('javascript-barcode-reader')
const os = require('os')
// const javascriptBarcodeReader = require('../../../Javascript-Barcode-Reader/src')

/**
 * Create worker process equal to cpu cores
 *
 * @returns {Array} array of child process forks
 */
async function createWorkerProcesses(imagesCount) {
  const WORKERS = []

  let NO_OF_CORES = await new Promise(resolve => {
    switch (os.platform()) {
      case 'win32':
        childProcess.exec('wmic CPU Get NumberOfCores', {}, (err, out) => {
          resolve(
            parseInt(
              out
                .replace(/\r/g, '')
                .split('\n')[1]
                .trim(),
              10,
            ),
          )
        })
        break
      case 'darwin':
      case 'linux':
        childProcess.exec('getconf _NPROCESSORS_ONLN', {}, (err, out) => {
          resolve(parseInt(out, 10))
        })
        break
      case 'freebsd':
      case 'openbsd':
        childProcess.exec('getconf NPROCESSORS_ONLN', {}, (err, out) => {
          resolve(parseInt(out, 10))
        })
        break
      case 'sunos':
        childProcess.exec(
          'kstat cpu_info|grep core_id|sort -u|wc -l',
          {},
          (err, out) => {
            resolve(parseInt(out, 10))
          },
        )
        break
      default:
        resolve()
        break
    }
  })

  NO_OF_CORES = Math.min(NO_OF_CORES || os.cpus().length / 2, imagesCount)

  // If available ram is less than 500MB, use only two worker processes
  if ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024) < 0.5) {
    NO_OF_CORES = 2
  }

  for (let i = 0; i < NO_OF_CORES; i += 1) {
    WORKERS.push(childProcess.fork(`${__dirname}/processTaskWorker.js`))
  }

  return WORKERS
}

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
  let rx
  let ry
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
      const transform = $(group)
        .attr('transform')
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')
        .map(val => parseInt(val, 10))

      const rect = $(group)
        .find('rect')
        .first()

      const left = parseInt(rect.attr('x'), 10)
      const top = parseInt(rect.attr('y'), 10)

      rx = parseInt(rect.attr('rx') || 0, 10)
      ry = parseInt(rect.attr('ry') || 0, 10)

      x = left - rx + transform[0]
      y = top - ry + transform[1]

      width = parseInt(rect.attr('width'), 10) + rx
      height = parseInt(rect.attr('height'), 10) + ry
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
  const formats = [
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

  return fastGlob(`${path}/*.{${formats.join(',')}}`, {
    onlyFiles: true,
  })
}

/**
 * Returns a trained neural network function
 * @returns {Function} Neural network function
 */
function getNeuralNet(src) {
  const net = new brain.NeuralNetwork()

  return net.fromJSON(
    JSON.parse(
      fs.readFileSync(src || `${__dirname}/../../src/data/training-data.json`),
    ),
  )
}

/**
 *
 * @param {Object} designData A JSON Object containing information about the position, width, height of elements in svg design file (available from utiltities/getDesignData)
 * @param {String} path Path of scanned image file
 * @param {Object=} resultsData Path to csv file for training data
 * @param {Number=} rollNo Roll no of the current scanned image
 * @returns {Object} {title: {String}, data: {buffer}}
 */
async function getQuestionsData(designData, img, resultsData, rollNo) {
  const SCALE = 0.5
  const IS_TEST_DATA = resultsData && rollNo

  return new Promise((resolveCol, rejectCol) => {
    img.resize(designData.width * SCALE).max()

    const promises = []
    // extract all questions portions
    Object.keys(designData.questions).forEach(title => {
      const p = new Promise(resolve => {
        const q = designData.questions[title]

        img
          .extract({
            left: Math.floor(q.x1 * SCALE),
            top: Math.floor(q.y1 * SCALE),
            width: Math.ceil((q.x2 - q.x1) * SCALE),
            height: Math.ceil((q.y2 - q.y1) * SCALE),
          })
          // .toColourspace('b-w')
          // .threshold(175)
          .png()
          .toFile(`${__dirname}\\tmp\\${`${rollNo}-${title}`}.png`, err => {
            if (err) console.log(err)

            resolve()
          })
        /*
          .toBuffer({
            resolveWithObject: true,
          })
          .then(res => {
            const data = res.data.map(val => (val === 0 ? 1 : 0))

            if (IS_TEST_DATA) {
              // for training data
              if (resultsData[rollNo] && resultsData[rollNo][title] !== '*') {
                const o = {}
                o[resultsData[rollNo][title]] = 1

                resolve({ input: data, output: o })
              } else {
                resolve(false)
              }
            } else {
              // for processing data
              resolve({ title, data })
            }
          })
          */
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
 * @returns {String} Roll Number
 */
async function getRollNoFromImage(designData, img) {
  const metadata = await img.metadata()
  const rollNoPos = designData.rollNo
  const ratio = metadata.width / designData.width
  const width = Math.ceil((rollNoPos.x2 - rollNoPos.x1) * ratio)
  const height = Math.ceil((rollNoPos.y2 - rollNoPos.y1) * ratio)

  const { data } = await img
    .extract({
      left: Math.floor(rollNoPos.x1 * ratio),
      top: Math.floor(rollNoPos.y1 * ratio),
      width,
      height,
    })
    .toBuffer({ resolveWithObject: true })

  // add missing channel
  const newData = []
  for (let i = 0; i < data.length; i += 3) {
    newData.push(data[i])
    newData.push(data[i + 1])
    newData.push(data[i + 2])
    newData.push(255)
  }

  return javascriptBarcodeReader(
    { data: newData, width, height },
    { barcode: 'code-39' },
  )
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
  createWorkerProcesses,
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getRollNoFromImage,
  readCsvToJson,
  readJsonToCsv,
  getQuestionsData,
}

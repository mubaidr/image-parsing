const brain = require('brain.js')
const fastGlob = require('fast-glob')
const fs = require('fs')
const quagga = require('quagga').default
const sharp = require('sharp')

function clock(start) {
  if (!start) return process.hrtime()
  const end = process.hrtime(start)
  return Math.round(end[0] * 1000 + end[1] / 1000000)
}

async function getDesignData(designFilePath) {
  const designData = {
    questions: {},
  }
  const ROLL_NO_PATTERN = new RegExp(/rollnobarcode/gi)
  const QUESTION_PATTERN = new RegExp(/(q[1-9][0-9]?[ad])\b/gi)

  const container = document.createElement('div')
  container.style.visibility = 'hidden'
  container.innerHTML = fs.readFileSync(designFilePath, 'utf8')
  const svg = container.getElementsByTagName('svg')[0]

  designData.width = Math.ceil(svg.viewBox.baseVal.width)
  designData.height = Math.ceil(svg.viewBox.baseVal.height)

  let gotRollNo = false
  let x
  let y
  let width
  let height

  svg.getElementsByTagName('g').forEach(group => {
    const title = group
      .getElementsByTagName('title')[0]
      .innerHTML.trim()
      .toLowerCase()

    const isQuestionGroup = QUESTION_PATTERN.test(title)
    const isRollNoGroup =
      isQuestionGroup || gotRollNo ? false : ROLL_NO_PATTERN.test(title)

    if (isQuestionGroup || isRollNoGroup) {
      const rect = group.getElementsByTagName('rect')[0]

      const transform = group
        .getAttribute('transform')
        .replace(/(translate)|\(|\)/gi, '')
        .split(',')

      x = parseInt(rect.getAttribute('x'), 10) + parseInt(transform[0] || 0, 10)
      y = parseInt(rect.getAttribute('y'), 10) + parseInt(transform[1] || 0, 10)

      width = parseInt(rect.getAttribute('width'), 10)
      height = parseInt(rect.getAttribute('height'), 10)
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
  })

  return designData
}

function getImagePaths(path, options) {
  return fastGlob(
    `${options[path].source.image}/*.{${options.validFormats.image.join(',')}}`,
    {
      onlyFiles: true,
    }
  )
}

function getNeuralNet() {
  const net = new brain.NeuralNetwork()

  const trainingData = JSON.parse(
    fs.readFileSync(`${global.__paths.trainingData}\\data.json`)
  )

  return net.fromJSON(trainingData).toFunction()
}

async function getResultData(resultFilePath) {
  const resultData = {}
  const resultFile = fs.readFileSync(resultFilePath, 'utf8')

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

async function getRollNoFromImage(path, designData) {
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

function jsonToCsv(obj) {
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
  clock,
  getDesignData,
  getImagePaths,
  getNeuralNet,
  getResultData,
  getRollNoFromImage,
  jsonToCsv,
}

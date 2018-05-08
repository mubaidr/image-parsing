const fs = require('fs')
const fastGlob = require('fast-glob')
const sharp = require('sharp')
const Quagga = require('quagga').default
const Store = require('electron-store')

const store = new Store()
const options = store.get('options')

module.exports = {
  getDesignData: async () => {
    const designData = {
      questions: {}
    }
    const rollNoPattern = new RegExp(/rollnobarcode/gi)
    const questionPattern = new RegExp(/(q[1-9][0-9]?[ad])\b/gi) // Match roll and questions options a & d

    const container = document.createElement('div')
    container.innerHTML = fs.readFileSync(options.train.source.designFile,
      'utf8')
    const svg = container.getElementsByTagName('svg')[0]
    const groups = svg.getElementsByTagName('g')

    designData.width = Math.ceil(svg.viewBox.baseVal.width)
    designData.height = Math.ceil(svg.viewBox.baseVal.height)

    let transform
    let x
    let y
    let width
    let height
    let optionTitle
    let QuestionNumber

    for (let i = 0; i < groups.length; i += 1) {
      const group = groups[i]
      const title = group
        .getElementsByTagName('title')[0]
        .innerHTML.trim()
        .toLowerCase()

      if (questionPattern.test(title)) {
        transform = group
          .getAttribute('transform')
          .replace(/(translate)|\(|\)/gi, '')
          .split(',')
          .map(item => parseInt(item, 10))

        x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'),
          10)
        y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'),
          10)

        x += transform[0]
        y += transform[1]

        width = parseInt(
          group.getElementsByTagName('rect')[0].getAttribute('width'),
          10
        )
        height = parseInt(
          group.getElementsByTagName('rect')[0].getAttribute('height'),
          10
        )

        optionTitle = title.slice(-1)
        QuestionNumber = title.slice(0, -1)

        if (!designData.questions[QuestionNumber]) {
          designData.questions[QuestionNumber] = {}
        }

        if (optionTitle === 'a') {
          designData.questions[QuestionNumber].x1 = x
          designData.questions[QuestionNumber].y1 = y
        } else {
          designData.questions[QuestionNumber].x2 = x + width
          designData.questions[QuestionNumber].y2 = y + height
        }
      } else if (rollNoPattern.test(title)) {
        transform = group
          .getAttribute('transform')
          .replace(/(translate)|\(|\)/gi, '')
          .split(',')
          .map(item => parseInt(item, 10))

        x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'),
          10)
        y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'),
          10)

        x += transform[0]
        y += transform[1]

        width = parseInt(
          group.getElementsByTagName('rect')[0].getAttribute('width'),
          10
        )
        height = parseInt(
          group.getElementsByTagName('rect')[0].getAttribute('height'),
          10
        )

        designData.rollNo = {
          x1: x,
          y1: y,
          x2: x + width,
          y2: y + height
        }
      }
    }

    return designData
  },

  getImagePaths() {
    return fastGlob(
      `${options.train.source.image}/*.{${options.validFormats.image.join(',')}}`, {
        onlyFiles: true
      }
    )
  },

  getResultData: async () => {
    const resultsData = {}
    const resultFile = fs.readFileSync(options.train.source.excelFile,
      'utf8')

    const rows = resultFile.split('\n')
    const headerValues = rows[0].split(',').map(word => word.toLowerCase())
    const rollNoIndex =
      headerValues.indexOf('rollno') ||
      headerValues.indexOf('rollnumber') ||
      headerValues.indexOf('rollno.') ||
      headerValues.indexOf('roll no') ||
      headerValues.indexOf('roll number')

    let values
    let obj

    for (let i = 1; i < rows.length; i += 1) {
      values = rows[i].split(',').map(word => word.toLowerCase())
      obj = {}

      // eslint-disable-next-line
      if (values.length <= 60) continue

      for (let j = 0; j < values.length; j += 1) {
        obj[headerValues[j]] = values[j] === '?' ? 'empty' : values[j]
      }

      resultsData[values[rollNoIndex]] = obj
    }

    return resultsData
  },

  getRollNoFromImageBuffer: async (path, designData) => {
    const img = sharp(path)
      .png()
      .flatten()
      .toColourspace('b-w')
      .threshold(32)
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
          height: Math.ceil((rollNoPos.y2 - rollNoPos.y1) * ratio)
        })
        .toBuffer()
        .then(buff => {
          Quagga.decodeSingle({
              decoder: {
                multiple: false,
                readers: ['code_39_reader']
              },
              locate: false,
              locator: {
                halfSample: true,
                patchSize: 'medium'
              },
              numOfWorkers: 0,
              src: `data:image/png;base64,${buff.toString('base64')}`
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
  },

  // function to encode file data to base64 encoded string
  base64_encode(bitmap) {
    return Buffer.from(bitmap).toString('base64')
  },

  // function to create file from base64 encoded string
  base64_decode(base64str) {
    return Buffer.from(base64str, 'base64')
  },

  // returns milliseconds passed since provided time
  clock(start) {
    if (!start) return process.hrtime()
    const end = process.hrtime(start)
    return Math.round(end[0] * 1000 + end[1] / 1000000)
  }
}

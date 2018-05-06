const Quagga = require('quagga').default

const fs = require('fs')
// const path = require('path')
// const brain = require('brain.js')
const sharp = require('sharp')
const fastGlob = require('fast-glob')
const Store = require('electron-store')

// const utilities = require('../../../utilities/utilities')

const store = new Store()
const options = store.get('options')

async function getDesignData() {
  const designData = {
    questions: {}
  }
  const rollNoPattern = new RegExp(/rollnobarcode/)
  const questionPattern = new RegExp(/(q[1-9][0-9]?[ad])\b/gi) // Match roll and questions options a & d

  const container = document.createElement('div')
  container.innerHTML = fs.readFileSync(options.train.source.designFile, 'utf8')
  const svg = container.getElementsByTagName('svg')[0]
  const groups = svg.getElementsByTagName('g')

  designData.width = parseInt(svg.viewBox.baseVal.width, 10)
  designData.height = parseInt(svg.viewBox.baseVal.height, 10)

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

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

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

      x = parseInt(group.getElementsByTagName('rect')[0].getAttribute('x'), 10)
      y = parseInt(group.getElementsByTagName('rect')[0].getAttribute('y'), 10)

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
}

// get Images
function getImagePaths() {
  return fastGlob(
    `${options.train.source.image}/*.{${options.validFormats.image.join(',')}}`, {
      onlyFiles: true
    }
  )
}

// Load results csv
async function getResultData() {
  const resultsData = {}
  const resultFile = fs.readFileSync(options.train.source.excelFile, 'utf8')

  const rows = resultFile.split('\n')
  const headerValues = rows[0].split(',').map(word => word.toLowerCase())
  const rollNoIndex = headerValues.indexOf('rollno') || headerValues.indexOf(
    'rollnumber') || headerValues.indexOf('rollno.') || headerValues.indexOf(
    'roll no') || headerValues.indexOf(
    'roll number')

  let values
  let obj

  for (let i = 1; i < rows.length; i += 1) {
    values = rows[i].split(',').map(word => word.toLowerCase())
    obj = {}

    // eslint-disable-next-line
    if (values.length <= 60) continue

    for (let j = 0; j < values.length; j += 1) {
      obj[headerValues[j]] = values[j]
    }

    resultsData[values[rollNoIndex]] = obj
  }

  return resultsData
}

async function getRollNoFromImageBuffer(path, designData) {
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
              patchSize: 'large'
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
}

async function prepareTrainingData(designData, resultsData, path) {
  return new Promise((resolve, reject) => {
    const promises = []

    const img = sharp(path).resize(designData.width)

    // extract all questions portions
    Object.keys(designData.questions).forEach(title => {
      const p = new Promise((resolve, reject) => {
        const q = designData.questions[title]

        const buff = img.extract({
          left: q.x1 - 10,
          top: q.y1 - 10,
          width: q.x2 - q.x1 + 10,
          height: q.y2 - q.y1 + 10
        }).raw().toBuffer()

        img.raw().toBuffer().then(buff => {
          const data = buff.toJSON().data.map(val => (val ===
            0 ?
            1 : 0))

          resolve(data)
        })

      })

      promises.push(p)
    })

    Promise.all(promises).then(res => {
      resolve(res)
    })
  })
}

module.exports = {
  async train(opt) {
    Promise.all([getDesignData(), getResultData(), getImagePaths()]).then(
      res => {
        const [designData, resultsData, paths] = res
        const promises = []

        // eslint-disable-next-line
        for (const path of paths) {
          const p = prepareTrainingData(designData, resultsData, path)
          promises.push(p)
        }

        Promise.all(promises).then(res => {
          console.log(res)
        })

        /*
          img.toFile(`${global.__paths.tmp}/${Math.random()}.png`, err => {
          if (err) console.log(err)
          })
        */
      }
    )
  }
}

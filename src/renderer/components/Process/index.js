const Quagga = require('quagga').default

const fs = require('fs')
// const path = require('path')
const brain = require('brain.js')
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
  const rollNoPattern = new RegExp(/rollnobarcode/gi)
  const questionPattern = new RegExp(/(q[1-9][0-9]?[ad])\b/gi) // Match roll and questions options a & d

  const container = document.createElement('div')
  container.innerHTML = fs.readFileSync(options.train.source.designFile, 'utf8')
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
    `${options.train.source.image}/*.{${options.validFormats.image.join(',')}}`,
    {
      onlyFiles: true
    }
  )
}

async function getRollNoFromImageBuffer(path, designData) {
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
        Quagga.decodeSingle(
          {
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
          resultsJSON => {
            if (resultsJSON.codeResult) {
              resolve(resultsJSON.codeResult.code)
            } else {
              reject(new Error('Unable to read barcode'))
            }
          }
        )
      })
  })
}

async function prepareTrainingData(designData, path) {
  return new Promise((resolve, reject) => {
    const promises = []
    const img = sharp(path)
      .resize(designData.width)
      .max()
      .raw()
      .toColourspace('b-w')
      .threshold(32)

    // extract all questions portions
    Object.keys(designData.questions).forEach(title => {
      const p = new Promise((resolve, reject) => {
        const q = designData.questions[title]

        img
          .extract({
            left: q.x1 - 10,
            top: q.y1 - 10,
            width: q.x2 - q.x1 + 10,
            height: q.y2 - q.y1 + 10
          })
          .toBuffer()
          .then(buff => {
            const data = buff.toJSON().data.map(val => (val === 0 ? 1 : 0))

            resolve({
              title,
              data
            })
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
  async process() {
    Promise.all([getDesignData(), getImagePaths()]).then(async res => {
      const resultsJSON = {}
      const [designData, paths] = res
      const net = new brain.NeuralNetwork()
      const trainingData = JSON.parse(
        fs.readFileSync(`${global.__paths.trainingData}\\data.json`)
      )

      console.log('\nLoading network...')
      net.fromJSON(trainingData)

      console.log('\nStarting processing...')

      // eslint-disable-next-line
      for (const path of paths) {
        const rollNo = await getRollNoFromImageBuffer(path, designData)
        prepareTrainingData(designData, path).then(output => {
          if (!resultsJSON[rollNo]) resultsJSON[rollNo] = {}

          output.forEach(q => {
            const pre = net.run(q.data)
            const resultArray = []

            Object.keys(pre).forEach((key, index) => {
              resultArray[index] = {
                key,
                val: pre[key]
              }
            })

            resultArray.sort((a, b) => b.val - a.val)

            if (
              resultArray[0].val >= 0.66 ||
              resultArray[0].val - resultArray[1].val >= 0.33
            ) {
              resultsJSON[rollNo][q.title] = resultArray[0].key
            } else {
              resultsJSON[rollNo][q.title] = '*'
            }
          })
        })
      }

      fs.writeFileSync(
        `${global.__paths.trainingData}\\data-output.json`,
        JSON.stringify(resultsJSON)
      )

      console.log(
        '\nResult data exported to: ',
        `${global.__paths.trainingData}, Result: \n`,
        resultsJSON
      )
    })
  }
}

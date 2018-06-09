const fs = require('fs')
const brain = require('brain.js')
const sharp = require('sharp')

/**
 * Import utilty functions
 */
const {
  getDesignData,
  getImagePaths,
  getRollNoFromImage,
  readCsvToJson,
} = require('./index')

async function prepareTrainingData(designData, path, resultsData, rollNo) {
  return new Promise(resolveMain => {
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
          /*
          .toFile(`${global.__paths.tmp}\\${rollNo}-${title}.png`, err => {
            if (err) console.log(err)
          })
          */
          .toBuffer()
          .then(buff => {
            const data = buff.toJSON().data.map(val => (val === 0 ? 1 : 0))

            if (resultsData[rollNo] && resultsData[rollNo][title] !== '*') {
              const o = {}
              o[resultsData[rollNo][title]] = 1

              resolve({
                input: data,
                output: o,
              })
            } else {
              resolve(false)
            }
          })
      })

      promises.push(p)
    })

    Promise.all(promises).then(res => {
      resolveMain({ rollNo, data: res })
    })
  })
}

async function train(
  designFilePath,
  imagesDirectory,
  resultsFilePath,
  neuralNetFilePath
) {
  const [designData, imagePaths, resultsData] = await Promise.all([
    getDesignData(designFilePath),
    getImagePaths(imagesDirectory),
    readCsvToJson(resultsFilePath),
  ])

  const promises = []

  for (let i = 0; i < imagePaths.length; i += 1) {
    const path = imagePaths[i]
    // eslint-disable-next-line
    const rollNo = await getRollNoFromImage(designData, path)

    if (rollNo) {
      const p = prepareTrainingData(designData, path, resultsData, rollNo)

      promises.push(p)
    } else {
      console.log('\nError: unable to read barcode from the file: ', path)
    }
  }

  Promise.all(promises).then(results => {
    const trainingData = []
    const net = new brain.NeuralNetwork()

    results.forEach(result => {
      result.data.forEach(data => {
        if (data) {
          trainingData.push({
            input: data.input,
            output: data.output,
          })
        }
      })
    })

    net.train(trainingData, {
      log: true,
      logPeriod: 1,
      // activation: 'leaky-relu'
    })

    console.log('Done!')
    fs.writeFileSync(neuralNetFilePath, net.toJSON)
  })
}

module.exports = {
  train,
}

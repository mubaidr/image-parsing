const fs = require('fs')
const brain = require('brain.js')
const sharp = require('sharp')

const options = [
  'D:\\Current\\image-parsing\\__tests__\\test-data\\design.svg',
  'D:\\Current\\image-parsing\\__tests__\\test-data\\images',
  'D:\\Current\\image-parsing\\__tests__\\test-data\\result.csv',
  'D:\\Current\\image-parsing\\src\\data\\training-data.json',
]
let trainingEnabled = true

/**
 * Import utilty functions
 */
const {
  getDesignData,
  getImagePaths,
  getRollNoFromImage,
  readCsvToJson,
  getQuestionsData,
} = require('./index')

function stop() {
  trainingEnabled = false
  console.log('Traning stopped!')
}

async function train(
  designFilePath,
  imagesDirectory,
  resultsFilePath,
  neuralNetFilePath,
) {
  if (arguments.length === 0) {
    this.train(...options)
    return
  }
  trainingEnabled = true
  console.log('Traning started!')

  /* eslint-disable */
  designFilePath = designFilePath || options[0]
  imagesDirectory = imagesDirectory || options[1]
  resultsFilePath = resultsFilePath || options[2]
  neuralNetFilePath = neuralNetFilePath || options[3]
  /* eslint-enable */

  const [designData, imagePaths, resultsData] = await Promise.all([
    getDesignData(designFilePath),
    getImagePaths(imagesDirectory),
    readCsvToJson(resultsFilePath),
  ])

  const promises = []

  for (let i = 0; i < imagePaths.length && trainingEnabled; i += 1) {
    const path = imagePaths[i]
    const sharpImage = sharp(path).raw()
    const sharpImageClone = sharpImage.clone()

    // eslint-disable-next-line
    const META_DATA = await sharpImage.metadata()

    // eslint-disable-next-line
    const rollNo = await getRollNoFromImage(designData, sharpImage, META_DATA)

    if (rollNo) {
      const p = new Promise(resolve => {
        getQuestionsData(
          designData,
          sharpImageClone,
          resultsData,
          rollNo,
          META_DATA,
        ).then(output => {
          resolve(output)
        })
      })
      promises.push(p)
    }
  }

  Promise.all(promises).then(results => {
    const trainingData = []
    const net = new brain.NeuralNetwork()

    results.forEach(result => {
      result.forEach(data => {
        trainingData.push({
          input: data.input,
          output: data.output,
        })
      })
    })

    if (trainingData.length > 0) {
      net.train(trainingData, {
        log: true,
        logPeriod: 1,
        errorThresh: 0.001,
      })

      console.log('Done!')
      fs.writeFileSync(neuralNetFilePath, JSON.stringify(net.toJSON()))
    }
  })
}

if (process) {
  process.on('train-start', () => {
    train()
  })

  process.on('train-stop', () => {
    stop()
  })
}

module.exports = {
  train,
  stop,
}

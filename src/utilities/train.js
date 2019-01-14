const brain = require('brain.js')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const dataPaths = require('./data-paths')

// default options
const DEFAULTS = [
  path.join(dataPaths.testData, 'design.svg'),
  path.join(dataPaths.testData, 'images'),
  path.join(dataPaths.testData, 'result.csv'),
  dataPaths.trainingData,
]

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

/**
 *  Trains the network using provided data and saves the trained network configuration in the provided path (neuralNetFilePath).
 *
 * @param {String=} designFilePath Path to design file.
 * @param {String=} imagesDirectory Path to Images directory.
 * @param {String=} resultsFilePath Path to result data CSV.
 * @param {String=} neuralNetFilePath Path where trained network configuration will be saved.
 */
async function start(
  designFilePath = DEFAULTS[0],
  imagesDirectory = DEFAULTS[1],
  resultsFilePath = DEFAULTS[2],
  neuralNetFilePath = DEFAULTS[3]
) {
  const [designData, imagePaths, resultsData] = await Promise.all([
    getDesignData(designFilePath),
    getImagePaths(imagesDirectory),
    readCsvToJson(resultsFilePath),
  ])

  const promises = []

  // extract roll no & question image data from images
  for (let i = 0; i < imagePaths.length; i += 1) {
    const imgPath = imagePaths[i]
    const sharpImage = sharp(imgPath)
      .raw()
      .flatten()
    const sharpImageClone = sharpImage.clone()

    // eslint-disable-next-line
    const rollNo = await getRollNoFromImage(designData, sharpImage)

    // if roll no is found only then add training data
    if (rollNo) {
      promises.push(
        getQuestionsData(designData, sharpImageClone, resultsData, rollNo)
      )
    }
  }

  // collect data from lal promises
  const results = await Promise.all(promises)
  const net = new brain.NeuralNetwork()
  const trainingData = []

  // format data for network
  results.forEach(result => {
    result.forEach(data => {
      trainingData.push({
        input: data.input,
        output: data.output,
      })
    })
  })

  // if data is collected, train network
  if (trainingData.length > 0) {
    net.train(trainingData, {
      log: true,
      logPeriod: 10,
      errorThresh: 0.0001,
    })

    // write trained network configuration to disk
    fs.writeFileSync(neuralNetFilePath, JSON.stringify(net.toJSON()))

    if (process && process.send) {
      process.send({ completed: true }, () => {
        process.exit(0)
      })
    } else {
      console.log('Traning completed!')
    }
  }
}

if (process && process.send) {
  process.on('message', () => {
    start()
  })
}

module.exports = {
  start,
}

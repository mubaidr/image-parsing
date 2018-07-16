const fs = require('fs')
const brain = require('brain.js')
const sharp = require('sharp')
const path = require('path')
const dataPaths = require('./data-paths')

// default options
const options = [
  path.join(dataPaths.testData, 'design.svg'),
  path.join(dataPaths.testData, 'images'),
  path.join(dataPaths.testData, 'result.csv'),
  dataPaths.trainingData,
]
// controls if training is enabled
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

/**
 * Stops the training in the immediate iteration
 */
function stop() {
  trainingEnabled = false
  console.log('Traning stopped!')
}

/**
 *  Trains the network using provided data and saves the trained network configuration in the provided path (neuralNetFilePath).
 *
 * @param {String=} designFilePath Path to design file.
 * @param {String=} imagesDirectory Path to Images directory.
 * @param {String=} resultsFilePath Path to result data CSV.
 * @param {String=} neuralNetFilePath Path where trained network configuration will be saved.
 */
async function train(
  designFilePath,
  imagesDirectory,
  resultsFilePath,
  neuralNetFilePath,
) {
  // if no arguments are rpovided use the defualt options
  if (arguments.length === 0) {
    this.train(...options)
    return
  }
  trainingEnabled = true
  console.log('Traning started!')

  const [designData, imagePaths, resultsData] = await Promise.all([
    getDesignData(designFilePath),
    getImagePaths(imagesDirectory),
    readCsvToJson(resultsFilePath),
  ])

  const promises = []

  // extract roll no & question image data from images
  for (let i = 0; i < imagePaths.length && trainingEnabled; i += 1) {
    const imgPath = imagePaths[i]
    const sharpImage = sharp(imgPath).raw()
    const sharpImageClone = sharpImage.clone() // .png()

    // eslint-disable-next-line
    const rollNo = await getRollNoFromImage(designData, sharpImage)

    // if roll no is found, then add training data
    if (rollNo) {
      promises.push(
        getQuestionsData(designData, sharpImageClone, resultsData, rollNo),
      )
    }
  }

  // collect data from lal promises
  Promise.all(promises).then(results => {
    const trainingData = []
    const net = new brain.NeuralNetwork()

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
      console.log(trainingData[0].output)

      net.train(trainingData, {
        log: true,
        logPeriod: 1,
        errorThresh: 0.001,
      })

      // write trained network configuration to disk
      console.log('Traning done!')
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

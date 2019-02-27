const brain = require('brain.js')
const fs = require('fs')

const {
  getImagePaths,
  getRollNoFromImage,
  getSharpObjectFromSource,
} = require('./images')
const { getQuestionsData } = require('./questions')
const { getDesignData } = require('./design')
const { CSVToJSON } = require('./csv')
const DATAPATHS = require('./data-paths')

function completed(success) {
  if (success) {
    console.log('Completed')
  } else {
    console.log('Failed')
  }

  process.send({ completed: true }, () => {
    process.exit(0)
  })
}

/**
 *  Trains the network using provided data and saves the trained network configuration in the provided path (neuralNetFilePath).
 *
 * @param {String=} designFilePath Path to design file.
 * @param {String=} imagesDirectory Path to Images directory.
 * @param {String=} resultsFilePath Path to result data CSV.
 * @param {String=} neuralNetFilePath Path where trained network configuration will be saved.
 */
async function start(
  designFilePath = DATAPATHS.DEFAULTS.design,
  imagesDirectory = DATAPATHS.DEFAULTS.images,
  resultsFilePath = DATAPATHS.DEFAULTS.result,
  neuralNetFilePath = DATAPATHS.DEFAULTS.questionsModel
) {
  const [designData, imagePaths, resultsData] = await Promise.all([
    getDesignData(designFilePath),
    getImagePaths(imagesDirectory),
    CSVToJSON(resultsFilePath, true, false),
  ])

  const trainingData = []

  // extract roll no & question image data from images
  for (let i = 0; i < imagePaths.length; i += 1) {
    const sharpImage = getSharpObjectFromSource(imagePaths[i])
    const sharpImageClone = sharpImage.clone()

    const rollNo = await getRollNoFromImage(designData, sharpImage)
    if (!rollNo) continue

    const d = await getQuestionsData(
      designData,
      sharpImageClone,
      resultsData,
      rollNo
    )

    trainingData.push(...d)
  }

  // if data is collected, train network
  if (trainingData.length === 0) completed(false)

  const net = new brain.NeuralNetwork()
  net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.0001,
  })

  // write trained network configuration to disk
  fs.writeFileSync(neuralNetFilePath, JSON.stringify(net.toJSON()))

  completed(true)
}

process.on('message', () => {
  start()
})

// module.exports = {
//   start,
// }

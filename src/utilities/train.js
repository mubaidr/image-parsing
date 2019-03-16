const brain = require('brain.js')
const fs = require('fs')

const { getSharpObjectFromSource } = require('./images')
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

  if (process && process.send) {
    process.send({ completed: true }, () => {
      process.exit(0)
    })
  }
}

/**
 *  Trains the network using provided data and saves the trained network configuration in the provided path (neuralNetFilePath).
 *
 *
 */
async function start() {
  const [designData, resultsData] = await Promise.all([
    getDesignData(DATAPATHS.DEFAULTS.design),
    CSVToJSON(DATAPATHS.DEFAULTS.key, true),
  ])

  // extract roll no & question image data from images
  const sharpImage = getSharpObjectFromSource(DATAPATHS.DEFAULTS.keyImage)

  const trainingData = await getQuestionsData(
    designData,
    sharpImage,
    resultsData[0]
  )

  const net = new brain.NeuralNetwork()
  net.train(trainingData, {
    log: true,
    logPeriod: 10,
    errorThresh: 0.0001,
  })

  // write trained network configuration to disk
  fs.writeFileSync(
    DATAPATHS.DEFAULTS.questionsModel,
    JSON.stringify(net.toJSON())
  )

  completed(true)
}

process.on('message', e => {
  if (e.stop) {
    console.log('Stoping...')
    process.exit(0)
  } else {
    start()
  }
})

module.exports = {
  start,
}

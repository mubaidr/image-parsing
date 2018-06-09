const fs = require('fs')
const brain = require('brain.js')

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
      const p = new Promise(resolve => {
        getQuestionsData(designData, path, resultsData, rollNo).then(output => {
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

    net.train(trainingData, {
      log: true,
      logPeriod: 1,
      errorThresh: 0.001,
      activation: 'leaky-relu',
    })

    console.log('Done!')
    fs.writeFileSync(neuralNetFilePath, JSON.stringify(net.toJSON()))
  })
}

module.exports = {
  train,
}

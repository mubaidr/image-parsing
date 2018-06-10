// const fs = require('fs')
const { fork } = require('child_process')
const os = require('os')

/**
 * Import utilty functions
 */
const {
  getDesignData,
  getImagePaths,
  getNeuralNet,
  // readJsonToCsv,
} = require('./index')

/**
 * Start processing scanned image files to get result
 *
 * @param {String} designFilePath design file path
 * @param {String} imagesDirectory scanned images directory
 * @param {String} neuralNetFilePath neuralNet file path
 * @param {String} outputPath output path
 *
 * @returns null
 */
async function process(
  designFilePath,
  imagesDirectory,
  neuralNetFilePath
  // outputPath
) {
  const imagePaths = await getImagePaths(imagesDirectory)

  const TOTAL_IMAGES = imagePaths.length
  const NO_OF_CORES = Math.min(os.cpus().length, TOTAL_IMAGES)
  const STEP = Math.floor(TOTAL_IMAGES / NO_OF_CORES)

  Promise.all([
    getDesignData(designFilePath),
    getNeuralNet(neuralNetFilePath),
  ]).then(res => {
    const [designData, neuralNet] = res

    for (let i = 0; i < NO_OF_CORES; i += 1) {
      const startIndex = i * STEP
      const endIndex = i === NO_OF_CORES - 1 ? TOTAL_IMAGES : (i + 1) * STEP

      const worker = fork(`${__dirname}/processTaskWorker.js`)
      worker.on('message', response => {
        // TODO: collect result
        console.log('message: ', response)
      })

      worker.send({
        designData,
        imagePaths: imagePaths.slice(startIndex, endIndex),
        neuralNet,
      })
    }
  })
}

module.exports = {
  process,
}

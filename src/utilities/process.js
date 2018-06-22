/* eslint-enable */
const { processTask } = require('./processTaskWorker')

const os = require('os')
/* eslint-disable */
const { remote } = require('electron')

/**
 * Import utilty functions
 */
const { getDesignData, getImagePaths, getNeuralNet } = require('./index')

/**
 * Start processing scanned image files to get result
 *
 * @param {String} designFilePath design file path
 * @param {String} imagesDirectory scanned images directory
 * @param {String} neuralNetFilePath neuralNet file path
 * @param {String} outputPath output path
 * @param {Boolean} useWorkers Enable parrallel processing
 *
 * @returns null
 */
async function process(
  designFilePath,
  imagesDirectory,
  neuralNetFilePath,
  outputPath,
  useWorkers
) {
  const imagePaths = await getImagePaths(imagesDirectory)

  Promise.all([
    getDesignData(designFilePath),
    getNeuralNet(neuralNetFilePath),
  ]).then(res => {
    const [designData, neuralNet] = res

    if (!useWorkers) {
      processTask(designData, imagePaths, neuralNet).then(res => {
        console.log(res)
      })
    } else {
      const TOTAL_IMAGES = imagePaths.length
      const NO_OF_PROCESSES = Math.min(os.cpus().length, TOTAL_IMAGES)
      const STEP = Math.floor(TOTAL_IMAGES / NO_OF_PROCESSES)
      const WORKER_PROCESSES = remote.getGlobal('WORKER_PROCESSES')

      for (let i = 0; i < NO_OF_PROCESSES; i += 1) {
        const startIndex = i * STEP
        const endIndex =
          i === NO_OF_PROCESSES - 1 ? TOTAL_IMAGES : (i + 1) * STEP

        const worker = WORKER_PROCESSES[i]

        worker.on('message', (a, b, c) => {
          console.log(a, b, c)
        })

        worker.on('close', (a, b, c) => {
          console.log(a, b, c)
        })

        worker.on('error', (a, b, c) => {
          console.log(a, b, c)
        })

        worker.on('disconnect', (a, b, c) => {
          console.log(a, b, c)
        })

        worker.on('exit', (a, b, c) => {
          console.log(a, b, c)
        })

        worker.send({
          designData,
          imagePaths: imagePaths.slice(startIndex, endIndex),
          neuralNet,
        })
      }
    }
  })
}

module.exports = {
  process,
}

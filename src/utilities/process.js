/**
 * Import utilty functions
 */
const { processTask } = require('./processTaskWorker')
const {
  createWorkerProcesses,
  getDesignData,
  getImagePaths,
} = require('./index')

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
  outputPath,
  useWorkers
) {
  console.time('PREPARE-DATA')
  const imagePaths = await getImagePaths(imagesDirectory)
  const designData = await getDesignData(designFilePath)
  console.timeEnd('PREPARE-DATA')

  if (!useWorkers) {
    console.time('PROCESS-DATA-USING-SINGLE-THREAD')

    processTask(designData, imagePaths).then(res => {
      console.timeEnd('PROCESS-DATA-USING-SINGLE-THREAD')

      console.log(res)
    })
  } else {
    const TOTAL_IMAGES = imagePaths.length
    const WORKER_PROCESSES = createWorkerProcesses(TOTAL_IMAGES)
    const STEP = Math.floor(TOTAL_IMAGES / WORKER_PROCESSES.length)

    for (let i = 0; i < WORKER_PROCESSES.length; i += 1) {
      const startIndex = i * STEP
      const endIndex =
        i === WORKER_PROCESSES - 1 ? TOTAL_IMAGES : (i + 1) * STEP
      const worker = WORKER_PROCESSES[i]

      console.time(`PROCESS-DATA-USING-THREAD-${i}`)
      worker.send({
        designData,
        imagePaths: imagePaths.slice(startIndex, endIndex),
      })
      worker.on('message', res => {
        console.timeEnd(`PROCESS-DATA-USING-THREAD-${i}`)
        console.log(res)
      })
    }
  }
}

module.exports = {
  process,
}

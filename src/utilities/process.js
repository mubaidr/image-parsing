/**
 * Import utilty functions
 */
const { processTask } = require('./processTaskWorker')
const {
  createWorkerProcesses,
  getDesignData,
  getImagePaths,
} = require('./index')

// store reference to all workers
let WORKER_PROCESSES

/**
 * Stops all worker processes
 */
function stop() {
  for (let i = 0; i < WORKER_PROCESSES.length; i += 1) {
    WORKER_PROCESSES[i].send({
      stop: true,
    })
  }
}

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
  useWorkers,
) {
  const imagePaths = await getImagePaths(imagesDirectory)
  const designData = await getDesignData(designFilePath)

  if (!useWorkers) {
    processTask(designData, imagePaths).then(res => {
      console.log(res)
    })
  } else {
    const TOTAL_IMAGES = imagePaths.length
    WORKER_PROCESSES = await createWorkerProcesses(TOTAL_IMAGES)
    const TOTAL_PROCESS = WORKER_PROCESSES.length
    const STEP = Math.floor(TOTAL_IMAGES / TOTAL_PROCESS)

    for (let i = 0; i < TOTAL_PROCESS; i += 1) {
      const startIndex = i * STEP
      const endIndex = i === TOTAL_PROCESS - 1 ? TOTAL_IMAGES : (i + 1) * STEP
      const worker = WORKER_PROCESSES[i]

      worker.send({
        designData,
        imagePaths: imagePaths.slice(startIndex, endIndex),
      })
      // eslint-disable-next-line
      worker.on('message', m => {
        if (m.progress) {
          console.log('Progress: ', m)
        } else if (m.completed) {
          console.log('Completed: ', m)
        } else {
          console.log(' What do you want? : ', m)
        }
      })
    }
  }
}

module.exports = {
  process,
  stop,
}

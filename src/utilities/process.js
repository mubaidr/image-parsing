const DATAPATHS = require('./data-paths')
const { createWorkerProcesses } = require('./workers')
const { getDesignData } = require('./design')
const { getImagePaths } = require('./images')

// store reference to all workers
let WORKER_PROCESSES
let TOTAL_IMAGES

// result collection
let RESULTS = []

/**
 * Stops all worker processes
 */
async function stop() {
  if (!WORKER_PROCESSES) return

  for (let i = 0; i < WORKER_PROCESSES.length; i += 1) {
    // exit workers
    if (WORKER_PROCESSES[i].connected) {
      WORKER_PROCESSES[i].kill()
    }
  }

  WORKER_PROCESSES.length = 0
  TOTAL_IMAGES.length = 0
  RESULTS.length = 0
}

async function addWorkerHandlers(worker, callback) {
  // results collection and progress
  worker.on('message', data => {
    if (data.completed) {
      RESULTS = RESULTS.concat(data.results)

      // check if all process have returned result
      if (RESULTS.length === TOTAL_IMAGES) {
        // report view of completion
        callback({
          completed: true,
          results: [...RESULTS],
        })

        // exit all workers & reset data
        stop()
      }
    } else if (data.progress) {
      callback(data)
    }
  })

  // logging
  worker.stdout.on('data', data => {
    console.info('Info: ', data.toString())
  })

  // error
  worker.stderr.on('data', data => {
    console.error('Error: ', data.toString())

    callback({
      error: data.toString(),
    })
  })
}

/**
 * Start processing scanned image files to get result
 *
 * @param {Function} callback Callback function for updates
 * @param {String} imagesDirectory scanned images directory
 * @param {String} keyFilePath design file path
 *
 * @returns {Object} {totalImages, totalWorkers}
 */
async function start(
  callback,
  imagesDirectory = DATAPATHS.test.images,
  imageFile
) {
  // reset result collection
  const designData = await getDesignData(DATAPATHS.test.design)
  const imagePaths = imagesDirectory
    ? await getImagePaths(imagesDirectory)
    : [imageFile]

  TOTAL_IMAGES = imagePaths.length
  WORKER_PROCESSES = await createWorkerProcesses(TOTAL_IMAGES)
  const TOTAL_PROCESS = WORKER_PROCESSES.length
  const STEP = Math.floor(TOTAL_IMAGES / TOTAL_PROCESS)

  for (let i = 0; i < TOTAL_PROCESS; i += 1) {
    const startIndex = i * STEP
    const endIndex = i === TOTAL_PROCESS - 1 ? TOTAL_IMAGES : (i + 1) * STEP
    const worker = WORKER_PROCESSES[i]

    // initiate processing
    worker.send({
      designData,
      imagePaths: imagePaths.slice(startIndex, endIndex),
    })

    // add handlers
    addWorkerHandlers(worker, callback)
  }

  return {
    totalImages: TOTAL_IMAGES,
    totalWorkers: WORKER_PROCESSES.length,
  }
}

module.exports = {
  start,
  stop,
}

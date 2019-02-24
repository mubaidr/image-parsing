const dataPaths = require('./data-paths')
const { createWorkerProcesses } = require('./workers')
const { getDesignData } = require('./design')
const { getImagePaths } = require('./images')

// store reference to all workers
let WORKER_PROCESSES

// result collection
const results = []

/**
 * Stops all worker processes
 */
function stop() {
  for (let i = 0; i < WORKER_PROCESSES.length; i += 1) {
    if (WORKER_PROCESSES[i].connected) {
      WORKER_PROCESSES[i].send({
        stop: true,
      })
    }
  }
}

/**
 * Start processing scanned image files to get result
 *
 * @param {Function} listner Callback function for updates
 * @param {String?} designFilePath design file path
 * @param {String} imagesDirectory scanned images directory
 * @param {Boolean} useWorkers Enable parrallel processing
 *
 * @returns {Object} {totalImages, totalWorkers}
 */
async function start(
  listner,
  imagesDirectory = dataPaths.DEFAULTS.images,
  designFilePath = dataPaths.DEFAULTS.design
) {
  // reset result collection
  const [imagePaths, designData] = await Promise.all([
    getImagePaths(imagesDirectory),
    getDesignData(designFilePath),
  ])

  const TOTAL_IMAGES = imagePaths.length
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

    worker.on('message', m => {
      // collect result from process
      if (m.completed) {
        results.concat(m.results)

        // check if all process have returned result
        if (results.length === TOTAL_PROCESS) {
          // report view of completion
          listner({
            completed: true,
            // reduce into object format
            results,
          })

          // reset results array
          results.length = 0
        }
      } else if (m.progress && listner) {
        listner(m)
      } else {
        console.log(m)
      }
    })

    // logging
    worker.stdout.on('data', data => {
      if (listner) {
        listner({
          log: data.toString(),
        })
      } else {
        console.log(data.toString())
      }
    })

    // error
    worker.stderr.on('data', data => {
      if (listner) {
        listner({
          error: data.toString(),
        })
      } else {
        console.log(data.toString())
      }
    })
  }

  return {
    totalImages: imagePaths.length,
    totalWorkers: WORKER_PROCESSES.length,
  }
}

module.exports = {
  start,
  stop,
}

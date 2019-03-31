import childProcess from 'child_process'
import IDesignData from '../@interfaces/IDesignData'
import IKey from '../@interfaces/IKey'
import { DATAPATHS } from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { createWorkerProcesses } from './workers'

// store reference to all workers
let DESIGNDATA: IDesignData
let WORKER_PROCESSES: childProcess.ChildProcess[]
let TOTAL_IMAGES: number

// result collection
const RESULTS: IKey[] = []

/**
 * Stops all worker processes
 */
async function stop() {
  if (!WORKER_PROCESSES || WORKER_PROCESSES.length === 0) {
    return
  }

  for (const worker of WORKER_PROCESSES) {
    // exit workers
    if (worker.connected) {
      worker.kill()
    }
  }

  WORKER_PROCESSES.length = 0
  RESULTS.length = 0
  TOTAL_IMAGES = 0
}

async function addWorkerHandlers(worker, callback) {
  // results collection and progress
  worker.on('message', data => {
    if (data.completed) {
      RESULTS.push(...data.results)

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
    } else {
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
async function start(callback, imagesDirectory, imageFile) {
  // reset result collection
  const imagePaths = imagesDirectory
    ? await getImagePaths(imagesDirectory)
    : [imageFile]

  TOTAL_IMAGES = imagePaths.length
  ;[DESIGNDATA, WORKER_PROCESSES] = await Promise.all([
    getDesignData(DATAPATHS.test.design),
    createWorkerProcesses(TOTAL_IMAGES),
  ])

  const TOTAL_PROCESS = WORKER_PROCESSES.length
  const STEP = Math.floor(TOTAL_IMAGES / TOTAL_PROCESS)

  for (let i = 0; i < TOTAL_PROCESS; i += 1) {
    const startIndex = i * STEP
    const endIndex = i === TOTAL_PROCESS - 1 ? TOTAL_IMAGES : (i + 1) * STEP
    const worker = WORKER_PROCESSES[i]

    // initiate processing
    worker.send({
      designData: DESIGNDATA,
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

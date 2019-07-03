import childProcess from 'child_process'
import IDesignData from './@interfaces/IDesignData'
import IKey from './@interfaces/IKey'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { processTask } from './processTaskWorker'
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

type addWorkerHandlersGetter = (
  worker: childProcess.ChildProcess,
  callback: (data: object) => void
) => Promise<void>

const addWorkerHandlers: addWorkerHandlersGetter = async (worker, callback) => {
  // results collection and progress
  worker.on('message', data => {
    if (data.completed) {
      RESULTS.push(...data.results)

      // check if all process have returned result
      if (RESULTS.length === TOTAL_IMAGES) {
        // report view of completion
        callback({
          completed: true,
          results: RESULTS.slice(0),
        })

        // exit all workers & reset data
        stop()
      }
    } else {
      callback(data)
    }
  })

  if (!worker.stdout || !worker.stderr) {
    return
  }

  // logging
  worker.stdout.on('data', data => {
    console.info(Buffer.from(data, 'utf-8').toString())
  })

  // error
  worker.stderr.on('data', data => {
    console.error(Buffer.from(data, 'utf-8').toString())
  })
}

interface IFileInfo {
  totalImages: number
  totalWorkers: number
}

type startGetter = (
  callback: (data: object) => void,
  imagesDirectory: string,
  imageFile?: string,
  inProcess?: boolean
) => Promise<IFileInfo>

const start: startGetter = async (
  callback,
  imagesDirectory,
  imageFile?,
  inProcess?
) => {
  ;[DESIGNDATA, WORKER_PROCESSES] = await Promise.all([
    getDesignData(dataPaths.designBarcode),
    createWorkerProcesses(),
  ])

  // reset result collection
  const imagePaths = imagesDirectory
    ? await getImagePaths(imagesDirectory)
    : [imageFile || '']

  if (inProcess) {
    processTask(DESIGNDATA, imagePaths).then(res => {
      callback({
        completed: true,
        results: res,
      })
    })
  } else {
    TOTAL_IMAGES = imagePaths.length
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
  }

  return {
    totalImages: TOTAL_IMAGES,
    totalWorkers: inProcess ? 1 : WORKER_PROCESSES.length,
  }
}

export { start, stop }

import childProcess from 'child_process'
import ICodeScan from './@interfaces/ICodeScan'
import IDesignData from './@interfaces/IDesignData'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { processTask } from './processTaskWorker'
import { createWorkerProcesses } from './workers'

// store reference to all workers
let DESIGN_DATA: IDesignData
let WORKER_PROCESSES: childProcess.ChildProcess[]
let IMAGES_COUNT: number

// result collection
const RESULT_SET: ICodeScan[] = []

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
  RESULT_SET.length = 0
  IMAGES_COUNT = 0
}

const addWorkerHandlers = async (
  worker: childProcess.ChildProcess,
  callback: (data: object) => void
): Promise<void> => {
  // results collection and progress
  worker.on('message', data => {
    if (data.completed) {
      RESULT_SET.push(...data.results)

      // check if all process have returned result
      if (RESULT_SET.length === IMAGES_COUNT) {
        // report view of completion
        callback({
          completed: true,
          results: RESULT_SET.slice(0),
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
  ;[DESIGN_DATA, WORKER_PROCESSES] = await Promise.all([
    getDesignData(dataPaths.designBarcode),
    createWorkerProcesses(),
  ])

  // reset result collection
  const imagePaths = imagesDirectory
    ? await getImagePaths(imagesDirectory)
    : [imageFile || '']

  if (inProcess) {
    processTask(DESIGN_DATA, imagePaths).then(res => {
      callback({
        completed: true,
        results: res,
      })
    })
  } else {
    IMAGES_COUNT = imagePaths.length
    const TOTAL_PROCESS = WORKER_PROCESSES.length
    const STEP = Math.floor(IMAGES_COUNT / TOTAL_PROCESS)

    for (let i = 0; i < TOTAL_PROCESS; i += 1) {
      const startIndex = i * STEP
      const endIndex = i === TOTAL_PROCESS - 1 ? IMAGES_COUNT : (i + 1) * STEP
      const worker = WORKER_PROCESSES[i]

      // initiate processing
      worker.send({
        designData: DESIGN_DATA,
        imagePaths: imagePaths.slice(startIndex, endIndex),
      })

      // add handlers
      addWorkerHandlers(worker, callback)
    }
  }

  return {
    totalImages: IMAGES_COUNT,
    totalWorkers: inProcess ? 1 : WORKER_PROCESSES.length,
  }
}

export { start, stop }

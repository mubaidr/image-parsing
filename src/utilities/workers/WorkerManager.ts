import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import { DesignData, getDesignData } from '../design'
import { getImagePaths } from '../images'
import { readKey } from '../readKey'
import { Result, ResultLike } from '../Result'
import { PROGRESS_STATES } from './PROGRESS_STATES'

const CPU_CORE_COUNT = cpus().length
const isElectron = navigator.userAgent.toLowerCase().indexOf(' electron/') > -1

enum WORKER_TYPES {
  COMPILE = 'compile',
  EXTRACT = 'extract',
  GENERATE = 'generate',
}

type WorkerOutputMessage = {
  progressState: PROGRESS_STATES
  payload?: ResultLike[]
}

export class WorkerManager extends EventEmitter {
  data: ResultLike[] = []
  workers: (Worker | ChildProcess)[] = []
  finishedWorkers = 0
  total = 0
  finished = 0

  constructor() {
    super()
  }

  errorHandler(error: Error | ErrorEvent): void {
    this.emit(PROGRESS_STATES.ERROR, error)
  }

  messageHandler(message: WorkerOutputMessage): void {
    const { progressState, payload } = message

    if (progressState === PROGRESS_STATES.PROGRESS) {
      this.finished += 1
      this.emit(PROGRESS_STATES.PROGRESS)
    }

    if (progressState === PROGRESS_STATES.COMPLETE) {
      this.finishedWorkers += 1

      if (payload) {
        this.data.push(...payload)
      }

      if (this.finishedWorkers === this.workers.length) {
        this.emit(PROGRESS_STATES.COMPLETE)
      }
    }
  }

  getClonedData(): Result[] {
    return this.data.map((d) => Object.assign(new Result(), d))
  }

  createWorkers(count: number, type: WORKER_TYPES): WorkerManager {
    const workerPath = `./dist_electron/workers/${type}.worker.js`
    this.stop()

    for (let i = 0; i < count; i += 1) {
      let worker: Worker | ChildProcess

      if (isElectron) {
        worker = new Worker(workerPath)
        worker.addEventListener(PROGRESS_STATES.ERROR, this.errorHandler)
        worker.addEventListener(PROGRESS_STATES.MESSAGE, (message) =>
          this.messageHandler(message.data)
        )
      } else {
        worker = fork(workerPath, {
          stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
          // silent: true,
        })
        worker.on(PROGRESS_STATES.ERROR, this.errorHandler)
        worker.on(PROGRESS_STATES.MESSAGE, this.messageHandler)
      }

      this.workers.push(worker)
    }

    return this
  }

  async extract(directory: string, designPath: string): Promise<Result[]> {
    const totalImages = getImagePaths(directory)
    let designData: DesignData

    try {
      designData = await getDesignData(designPath)
    } catch (err) {
      return err
    }

    const totalWorkers = Math.min(totalImages.length, CPU_CORE_COUNT)
    const step = Math.floor(totalImages.length / totalWorkers)
    this.total = totalImages.length

    return new Promise((resolve, reject) => {
      this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT)
        .on(PROGRESS_STATES.ERROR, reject)
        .on(PROGRESS_STATES.COMPLETE, () => {
          resolve(this.getClonedData())
        })

      this.workers.forEach((worker, index) => {
        const startIndex = index * step
        const endIndex =
          index === totalWorkers - 1 ? totalImages.length : (index + 1) * step

        if (worker instanceof Worker) {
          worker.postMessage({
            designData,
            imagePaths: totalImages.slice(startIndex, endIndex),
          })
        } else {
          worker.send(
            {
              designData,
              imagePaths: totalImages.slice(startIndex, endIndex),
            },
            (err) => {
              if (err) reject(err)
            }
          )
        }
      })
    })
  }

  async compile(
    resultPath: string,
    keyPath: string,
    correctMarks?: number,
    incorrectMarks?: number
  ): Promise<Result[]> {
    let keys: Result[] | undefined

    try {
      keys = await readKey(keyPath)
    } catch (err) {
      return err
    }

    this.total = 1

    return new Promise((resolve, reject) => {
      this.createWorkers(1, WORKER_TYPES.COMPILE)
        .on(PROGRESS_STATES.ERROR, reject)
        .on(PROGRESS_STATES.COMPLETE, () => {
          resolve(this.getClonedData())
        })

      const worker = this.workers[0]

      if (worker instanceof Worker) {
        worker.postMessage({
          resultPath,
          keys,
          correctMarks,
          incorrectMarks,
        })
      } else {
        worker.send(
          {
            resultPath,
            keys,
            correctMarks,
            incorrectMarks,
          },
          (err) => {
            if (err) reject(err)
          }
        )
      }
    })
  }

  async generate(): Promise<WorkerManager> {
    return new Promise((resolve, reject) => {
      this.createWorkers(CPU_CORE_COUNT, WORKER_TYPES.GENERATE)
        .on(PROGRESS_STATES.ERROR, reject)
        .on(PROGRESS_STATES.COMPLETE, resolve)
    })
  }

  async stop(): Promise<void> {
    this.workers.forEach((worker) => {
      if (worker instanceof Worker) {
        worker.terminate()
      } else {
        worker.unref()
        worker.kill()
      }
    })

    this.data.length = 0
    this.workers.length = 0
    this.finishedWorkers = 0
    this.total = 0
    this.finished = 0
  }
}

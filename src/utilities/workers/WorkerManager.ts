import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import { DesignData, getDesignData } from '../design'
import { getImagePaths } from '../images'
import { readKey } from '../readKey'
import { Result } from '../Result'
import { PROGRESS_STATES } from './PROGRESS_STATES'

const CPU_CORE_COUNT = cpus().length

enum WORKER_TYPES {
  COMPILE = 'compile',
  EXTRACT = 'extract',
  GENERATE = 'generate',
}

type WorkerOutputMessage = {
  progressState: PROGRESS_STATES
  payload?: Result[]
}

export class WorkerManager extends EventEmitter {
  data: Result[] = []
  workers: ChildProcess[] = []
  finished = 0
  inputCount = 0

  constructor() {
    super()
  }

  createWorkers(count: number, type: WORKER_TYPES): WorkerManager {
    this.stop()

    for (let i = 0; i < count; i += 1) {
      const worker = fork(`./dist_electron/workers/${type}.worker.js`, {
        stdio: ['ignore', process.stdout, 'pipe', 'ipc'],
      })
        .on(PROGRESS_STATES.EXIT, (code) => {
          this.emit(PROGRESS_STATES.EXIT, code)
        })
        .on(PROGRESS_STATES.ERROR, (error) => {
          this.emit(PROGRESS_STATES.ERROR, error)
        })
        .on(PROGRESS_STATES.MESSAGE, (message: WorkerOutputMessage) => {
          const { progressState, payload } = message

          if (progressState === PROGRESS_STATES.PROGRESS) {
            this.emit(PROGRESS_STATES.PROGRESS)
          }

          if (progressState === PROGRESS_STATES.COMPLETE) {
            this.finished += 1

            if (payload) {
              this.data.push(...payload.map((p) => Result.fromJson(p)))
            }

            if (this.finished === this.workers.length) {
              this.emit(PROGRESS_STATES.COMPLETE)
            }
          }
        })

      worker.stderr?.on('data', (msg) => {
        this.emit(PROGRESS_STATES.ERROR, msg.toString())
      })

      this.workers.push(worker)
    }

    return this
  }

  async extract(
    directory: string,
    designPath: string
  ): Promise<Result[] | undefined> {
    const totalImages = getImagePaths(directory)
    let designData: DesignData

    try {
      designData = await getDesignData(designPath)
    } catch (err) {
      return err
    }

    const totalWorkers = Math.min(totalImages.length, CPU_CORE_COUNT)
    const step = Math.floor(totalImages.length / totalWorkers)

    this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT)
    this.inputCount = totalImages.length

    return new Promise((resolve, reject) => {
      this.on(PROGRESS_STATES.ERROR, reject)
      this.on(PROGRESS_STATES.COMPLETE, () => {
        resolve(this.data)
      })

      this.workers.forEach((worker, index) => {
        const startIndex = index * step
        const endIndex =
          index === totalWorkers - 1 ? totalImages.length : (index + 1) * step

        worker.send(
          {
            designData,
            imagePaths: totalImages.slice(startIndex, endIndex),
          },
          (err) => {
            if (err) reject(err)
          }
        )
      })
    })
  }

  async compile(
    resultPath: string,
    keyPath: string,
    correctMarks?: number,
    incorrectMarks?: number
  ): Promise<Result[] | undefined> {
    let keys: Result[] | undefined

    try {
      keys = await readKey(keyPath)
    } catch (err) {
      return err
    }

    this.createWorkers(1, WORKER_TYPES.COMPILE)
    this.inputCount = 1

    return new Promise((resolve, reject) => {
      this.on(PROGRESS_STATES.ERROR, reject)
      this.on(PROGRESS_STATES.COMPLETE, () => {
        resolve(this.data)
      })

      this.workers[0].send(
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
    })
  }

  async generate(): Promise<WorkerManager> {
    this.createWorkers(CPU_CORE_COUNT, WORKER_TYPES.GENERATE)

    return new Promise((resolve, reject) => {
      this.on(PROGRESS_STATES.ERROR, reject)
      this.on(PROGRESS_STATES.COMPLETE, resolve)
    })
  }

  async stop(): Promise<void> {
    this.workers.forEach((w) => {
      w.unref()
      w.kill()
    })

    this.finished = 0
    this.inputCount = 0
    this.data.length = 0
    this.workers.length = 0
  }
}

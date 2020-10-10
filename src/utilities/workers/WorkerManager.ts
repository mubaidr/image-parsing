import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import { DesignData, getDesignData } from '../design'
import { getImagePaths } from '../images'
import { readKey } from '../readKey'
import { Result, ResultLike } from '../Result'
import { ProgressStates } from './ProgressStates'

const CPU_CORE_COUNT = cpus().length

enum WorkerTypes {
  COMPILE = 'compile',
  EXTRACT = 'extract',
  GENERATE = 'generate',
}

type WorkerOutputMessage = {
  progressState: ProgressStates
  payload?: ResultLike[]
}

export class WorkerManager extends EventEmitter {
  data: ResultLike[] = []
  workers: ChildProcess[] = []
  finishedWorkers = 0
  total = 0
  finished = 0

  constructor() {
    super()
  }

  getClonedData(): Result[] {
    return this.data.map((d) => Object.assign(new Result(), d))
  }

  createWorkers(count: number, type: WorkerTypes): WorkerManager {
    this.stop()

    for (let i = 0; i < count; i += 1) {
      const worker = fork(`./dist_electron/workers/${type}.worker.js`, {
        // stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
        // silent: true,
      })
        .on(ProgressStates.EXIT, (code) => {
          this.emit(ProgressStates.EXIT, code)
        })
        .on(ProgressStates.ERROR, (error) => {
          this.emit(ProgressStates.ERROR, error)
        })
        .on(ProgressStates.MESSAGE, (message: WorkerOutputMessage) => {
          const { progressState, payload } = message

          if (progressState === ProgressStates.PROGRESS) {
            this.finished += 1
            this.emit(ProgressStates.PROGRESS)
          }

          if (progressState === ProgressStates.COMPLETE) {
            this.finishedWorkers += 1

            if (payload) {
              this.data.push(...payload)
            }

            if (this.finishedWorkers === this.workers.length) {
              this.emit(ProgressStates.COMPLETE)
            }
          }
        })

      worker.stdout?.on('data', (msg) => {
        this.emit(ProgressStates.LOG, msg.toString())
        if (
          process &&
          (process.env.NODE_END === 'test' ||
            process.env.NODE_END === 'development')
        ) {
          console.log(msg.toString())
        }
      })

      worker.stderr?.on('data', (msg) => {
        this.emit(ProgressStates.ERROR, msg.toString())
        if (
          process &&
          (process.env.NODE_END === 'test' ||
            process.env.NODE_END === 'development')
        ) {
          console.error(msg.toString())
        }
      })

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
      this.createWorkers(totalWorkers, WorkerTypes.EXTRACT)
        .on(ProgressStates.ERROR, reject)
        .on(ProgressStates.COMPLETE, () => {
          resolve(this.getClonedData())
        })
        .workers.forEach((worker, index) => {
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
  ): Promise<Result[]> {
    let keys: Result[] | undefined

    try {
      keys = await readKey(keyPath)
    } catch (err) {
      return err
    }

    this.total = 1

    return new Promise((resolve, reject) => {
      this.createWorkers(1, WorkerTypes.COMPILE)
        .on(ProgressStates.ERROR, reject)
        .on(ProgressStates.COMPLETE, () => {
          resolve(this.getClonedData())
        })
        .workers[0].send(
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
    return new Promise((resolve, reject) => {
      this.createWorkers(CPU_CORE_COUNT, WorkerTypes.GENERATE)
        .on(ProgressStates.ERROR, reject)
        .on(ProgressStates.COMPLETE, resolve)
    })
  }

  async stop(): Promise<void> {
    this.workers.forEach((w) => {
      w.unref()
      w.kill()
    })

    this.data.length = 0
    this.workers.length = 0
    this.finishedWorkers = 0
    this.total = 0
    this.finished = 0
  }
}

import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'

const CPU_COUNT = cpus().length

export enum PROGRESS_STATES {
  PROGRESS = 'progress',
  COMPLETED = 'completed',
  ERROR = 'error',
  LOG = 'log',
  EXIT = 'exit',
}

enum WORKER_TYPES {
  COMPILE = 'compile',
  EXTRACT = 'extract',
  GENERATE = 'generate',
}

export type ItemInfo = {
  x: number
  y: number
  width: number
  height: number
}

export type DesignData = {
  id?: string
  name?: string
  width: number
  height: number
  code: ItemInfo
  questions: {
    [key: string]: ItemInfo
  }
}

type WorkerOutputMessage = {
  progressState: PROGRESS_STATES
  payload: any
}

export class WorkerManager extends EventEmitter {
  private data: any[] = []
  private workers: ChildProcess[] = []
  private finished = 0
  public inputCount = 0

  constructor() {
    super()
  }

  private async createWorkers(count: number, type: WORKER_TYPES) {
    for (let i = 0; i < count; i += 1) {
      const worker = fork(`./dist-electron/workers/${type}.worker.js`)

      worker.on('message', (message: WorkerOutputMessage) => {
        const { progressState, payload } = message

        if (progressState === PROGRESS_STATES.PROGRESS) {
          return this.emit(PROGRESS_STATES.PROGRESS)
        }

        if (progressState === PROGRESS_STATES.COMPLETED) {
          this.finished += 1

          if (payload) {
            this.data.push(payload)
          }

          if (this.finished === this.workers.length) {
            this.emit(PROGRESS_STATES.COMPLETED, this.data)
          }
        }
      })

      worker.on('exit', (code, signal) => {
        this.emit(PROGRESS_STATES.EXIT, code, signal)
      })

      worker.on('error', (error) => {
        this.emit(PROGRESS_STATES.ERROR, error)
      })

      if (worker.stdout) {
        worker.stdout.on('data', (data: Buffer) => {
          this.emit(PROGRESS_STATES.LOG, data.toString())
        })
      }

      this.workers.push(worker)
    }
  }

  public async extract(
    directory: string,
    designId: string,
  ): Promise<WorkerManager> {
    const [designData, totalImages] = await Promise.all([
      getDesignData(designId),
      getImagePaths(directory),
    ])
    const totalWorkers = Math.min(totalImages.length, CPU_COUNT)
    const step = Math.floor(totalImages.length / totalWorkers)
    await this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT)

    this.inputCount = totalImages.length

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex =
        i === totalWorkers - 1 ? totalImages.length : (i + 1) * step

      this.workers[i].send({
        designData,
        imagePaths: totalImages.slice(startIndex, endIndex),
      })
    }

    return this
  }

  public async generate(): Promise<WorkerManager> {
    await this.createWorkers(CPU_COUNT, WORKER_TYPES.GENERATE)

    return this
  }

  public async compile(): Promise<WorkerManager> {
    await this.createWorkers(CPU_COUNT, WORKER_TYPES.COMPILE)

    return this
  }

  public async stop(): Promise<void> {
    this.workers.forEach((w) => {
      w.kill('SIGKILL')
      w.unref()
    })

    this.finished = 0
    this.inputCount = 0
    this.data.length = 0
    this.workers.length = 0
    this.removeAllListeners()
  }
}

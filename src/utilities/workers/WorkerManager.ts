import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import CompiledResult from '../CompiledResult'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'
import { readKey } from '../readKey'

// TODO: integrate https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer

const CPU_CORE_COUNT = cpus().length

export enum PROGRESS_STATES {
  PROGRESS = 'progress',
  COMPLETE = 'completed',
  ERROR = 'error',
  LOG = 'log',
  EXIT = 'exit',
  DATA = 'data',
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
  isQrCode: boolean
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

  private createWorkers(count: number, type: WORKER_TYPES) {
    for (let i = 0; i < count; i += 1) {
      const worker = fork(`./dist_electron/workers/${type}.worker.js`)

      worker.on('message', (message: WorkerOutputMessage) => {
        const { progressState, payload } = message

        if (progressState === PROGRESS_STATES.PROGRESS) {
          return this.emit(PROGRESS_STATES.PROGRESS)
        }

        if (progressState === PROGRESS_STATES.COMPLETE) {
          this.finished += 1

          if (payload) {
            this.data.push(payload)
          }

          if (this.finished === this.workers.length) {
            this.emit(PROGRESS_STATES.COMPLETE, this.data)
          }
        }
      })

      worker.on(PROGRESS_STATES.EXIT, (code) => {
        this.emit(PROGRESS_STATES.EXIT, code)
      })

      worker.on(PROGRESS_STATES.ERROR, (error) => {
        this.emit(PROGRESS_STATES.ERROR, error)
      })

      if (worker.stdout) {
        worker.stdout.on(PROGRESS_STATES.DATA, (data: Buffer) => {
          this.emit(PROGRESS_STATES.LOG, data.toString())
        })
      }

      this.workers.push(worker)
    }
  }

  public async extract(directory: string, designPath: string): Promise<any[]> {
    const [designData, totalImages] = await Promise.all([
      getDesignData(designPath),
      getImagePaths(directory),
    ])
    const totalWorkers = Math.min(totalImages.length, CPU_CORE_COUNT)
    const step = Math.floor(totalImages.length / totalWorkers)

    this.inputCount = totalImages.length
    this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex =
        i === totalWorkers - 1 ? totalImages.length : (i + 1) * step

      this.workers[i].send({
        designData,
        imagePaths: totalImages.slice(startIndex, endIndex),
      })
    }

    return new Promise((resolve) => {
      this.on(PROGRESS_STATES.COMPLETE, resolve)
    })
  }

  public async compile(
    resultPath: string,
    keyPath: string,
    correctMarks?: number,
    incorrectMarks?: number
  ): Promise<any[]> {
    const results = CompiledResult.loadFromExcel(resultPath).getResults()
    const keys = await readKey(keyPath)
    const totalWorkers = Math.min(results.length, CPU_CORE_COUNT)
    const step = Math.floor(results.length / totalWorkers)

    this.inputCount = results.length
    this.createWorkers(totalWorkers, WORKER_TYPES.COMPILE)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex = i === totalWorkers - 1 ? results.length : (i + 1) * step

      this.workers[i].send({
        results: results.slice(startIndex, endIndex),
        keys,
        correctMarks,
        incorrectMarks,
      })
    }

    return new Promise((resolve) => {
      this.on(PROGRESS_STATES.COMPLETE, resolve)
    })
  }

  public async generate(): Promise<WorkerManager> {
    this.createWorkers(CPU_CORE_COUNT, WORKER_TYPES.GENERATE)

    return this
  }

  public async stop(): Promise<void> {
    this.workers.forEach((w) => {
      if (w.connected) {
        w.kill('SIGKILL')
        w.unref()
      }
    })

    this.finished = 0
    this.inputCount = 0
    this.data.length = 0
    this.workers.length = 0
    this.removeAllListeners()
  }
}

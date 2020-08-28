import { ChildProcess, fork } from 'child_process'
import { EventEmitter } from 'events'
import { cpus } from 'os'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'

const CPU_COUNT = cpus().length

export enum PROGRESS_STATES {
  PROGRESS = 'progress',
  SUCCESS = 'success',
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

  private async createWorkers(count: number, workerType: WORKER_TYPES) {
    await this.stop()

    for (let i = 0; i < count; i += 1) {
      const worker = fork(
        `./dist-electron/workers/${workerType}.worker.js`,
        [],
        {
          silent: true,
        },
      )

      console.log('yay')

      worker.on('message', (message: WorkerOutputMessage) => {
        const { progressState, payload } = message

        console.log(progressState)

        if (progressState === PROGRESS_STATES.PROGRESS) {
          return this.emit(PROGRESS_STATES.PROGRESS)
        }

        if (progressState === PROGRESS_STATES.SUCCESS) {
          this.finished += 1

          if (payload) {
            this.data.push(payload)
          }

          if (this.finished === this.workers.length) {
            this.emit(PROGRESS_STATES.SUCCESS, this.data)
          }
        }
      })

      worker.on('exit', (code, signal) => {
        // eslint-disable-next-line no-console
        // console.log(code, signal)
        this.emit('exit', code, signal)
      })

      worker.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.error(error)
        this.emit('error', error)
      })

      if (worker.stdout) {
        worker.stdout.on('data', (data: Buffer) => {
          // eslint-disable-next-line no-console
          console.log(data.toString())
          this.emit('log', data.toString())
        })
      }

      if (worker.stderr) {
        worker.stderr.on('data', (data: Buffer) => {
          // eslint-disable-next-line no-console
          console.error(data.toString())
          this.emit('error', new Error(data.toString()))
        })
      }

      this.workers.push(worker)
    }
  }

  public async extract(
    directory: string,
    designID: string,
  ): Promise<WorkerManager> {
    const designData = await getDesignData(designID)
    const totalImages = await getImagePaths(directory)
    const totalWorkers = Math.min(totalImages.length, CPU_COUNT)
    const step = Math.floor(totalImages.length / totalWorkers)

    this.inputCount = totalImages.length
    await this.createWorkers(totalWorkers, WORKER_TYPES.EXTRACT)

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

  public async stop(): Promise<WorkerManager> {
    this.workers.forEach((w) => {
      w.kill('SIGKILL')
      w.unref()
    })

    this.finished = 0
    this.data.length = 0
    this.workers.length = 0
    this.removeAllListeners()

    return this
  }
}

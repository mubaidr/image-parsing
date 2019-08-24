import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import path from 'path'
import noOfCores from 'physical-cpu-count'

import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import DesignData from '../@interfaces/DesignData'
import CompiledResult from './CompiledResult'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManager {
  private imagesCount: number = 0
  private results: Result[] = []
  private workerPath: string = isDev
    ? path.resolve('./dist/processTaskWorker.js')
    : path.resolve(__dirname, './processTaskWorker.js')
  private workers: ChildProcess[] = []

  public constructor() {
    this.create()
  }

  public create(): ChildProcess[] {
    for (let i = 0; i < noOfCores; i += 1) {
      this.workers.push(
        childProcess.fork(this.workerPath, [], {
          silent: true,
        })
      )
    }

    return this.workers
  }

  public getCount(): number {
    return this.workers.length
  }

  public process(
    designData: DesignData,
    images: string[],
    callback: Function
  ): {
    totalImages: number
    totalWorkers: number
  } {
    const totalWorkers = Math.min(images.length, this.getCount())
    const step = Math.floor(images.length / totalWorkers)

    this.imagesCount = images.length
    this.addWorkerHandlers(callback)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex = i === totalWorkers - 1 ? images.length : (i + 1) * step

      this.workers[i].send({
        designData: designData,
        imagePaths: images.slice(startIndex, endIndex),
      })
    }

    return { totalImages: images.length, totalWorkers: totalWorkers }
  }

  public reset(): ChildProcess[] {
    this.stop()
    return this.create()
  }

  public stop() {
    for (const worker of this.workers) {
      if (worker.connected) {
        worker.kill()
      }
    }

    this.imagesCount = 0
    this.workers.length = 0
    this.results.length = 0
  }

  private addWorkerHandlers(callback: Function) {
    this.workers.forEach(worker => {
      worker.on('message', (data: { state: string; results: Result[] }) => {
        if (data.state === ProgressStateEnum.COMPLETED) {
          this.results.push(...data.results)

          if (this.results.length === this.imagesCount) {
            const compiledResult = new CompiledResult()

            // repair prototype for objects
            this.results.forEach(result => {
              compiledResult.addResults(Result.fromJson(result))
            })

            callback({
              state: ProgressStateEnum.COMPLETED,
              compiledResult: compiledResult,
            })
          }
        } else {
          callback(data)
        }
      })

      if (!isDev || !worker.stdout || !worker.stderr) {
        return
      }

      worker.stdout.on('data', (data: Buffer) => {
        electronLog.log(data.toString())
      })

      worker.stderr.on('data', (data: Buffer) => {
        electronLog.error(data.toString())
      })

      worker.on('close', (a, b) => {
        if (a) {
          // TODO: track error state in parent
          electronLog.info(
            `child process exited with code: ${a} and signal ${b}`
          )
        } else {
          electronLog.info('child process exited with code 0.')
        }
      })
    })
  }
}

export default WorkerManager

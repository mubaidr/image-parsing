import childProcess, { ChildProcess } from 'child_process'
import path from 'path'
import noOfCores from 'physical-cpu-count'
import Result from '../@classes/Result'
import ProgressStateEnum from '../@enums/ProgressStateEnum'
import IDesignData from '../@interfaces/IDesignData'
import CompiledResult from './CompiledResult'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManager {
  private imagesCount: number = 0
  private workers: ChildProcess[] = []
  private results: Result[] = []

  private workerPath: string = isDev
    ? path.resolve('./dist/processTaskWorker.js')
    : path.resolve(__dirname, './processTaskWorker.js')

  public constructor() {
    this.create()
  }

  public getCount(): number {
    return this.workers.length
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

  public async reset(): Promise<ChildProcess[]> {
    this.stop()
    return this.create()
  }

  public process(
    designData: IDesignData,
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

      worker.stdout.on('readable', () => {
        const buff: Buffer = worker.stdout && worker.stdout.read()
        if (!buff) return

        console.info(buff.toString())
      })

      worker.stderr.on('readable', () => {
        const buff = worker.stderr && worker.stderr.read()
        if (!buff) return

        console.error(buff.toString())
      })
    })
  }
}

export default WorkerManager

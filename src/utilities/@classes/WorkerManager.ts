import childProcess, { ChildProcess } from 'child_process'
import path from 'path'
import noOfCores from 'physical-cpu-count'
import IDesignData from '../@interfaces/IDesignData'
import CompiledResult from './CompiledResult'

class WorkerManager {
  private imagesCount: number = 0
  private workers: ChildProcess[] = []
  private resultSet: CompiledResult[] = []

  private workerPath: string =
    process.env.NODE_ENV === 'development'
      ? path.resolve(__dirname, '../../dist/processTaskWorker.js')
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
    if (this.getCount() === 0) this.create()

    this.imagesCount = images.length
    const totalWorkers = Math.min(this.imagesCount, this.getCount())
    const step = Math.floor(this.imagesCount / totalWorkers)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex =
        i === totalWorkers - 1 ? this.imagesCount : (i + 1) * step

      this.workers[i].send({
        designData: designData,
        imagePaths: images.slice(startIndex, endIndex),
      })

      this.addWorkerHandlers(callback)
    }

    return { totalImages: this.imagesCount, totalWorkers: totalWorkers }
  }

  private addWorkerHandlers(callback: Function) {
    this.workers.forEach(worker => {
      worker.on('message', data => {
        if (data.completed) {
          this.resultSet.push(...data.results)

          // check if all process have returned result
          if (this.resultSet.length === this.imagesCount) {
            callback({
              completed: true,
              results: this.resultSet.slice(0),
            })

            this.stop()
          }
        } else {
          callback(data)
        }
      })

      if (!worker.stdout || !worker.stderr) {
        return
      }

      worker.stdout.on('data', data => {
        console.info(Buffer.from(data, 'utf-8').toString())
      })

      worker.stderr.on('data', data => {
        console.error(Buffer.from(data, 'utf-8').toString())
      })
    })
  }
}

export default WorkerManager

import childProcess, { ChildProcess } from 'child_process'
import noOfCores from 'physical-cpu-count'

class WorkerManager {
  public workerPath: string
  public expectedOutputCount: number
  public workers: ChildProcess[]

  public constructor(workerPath: string) {
    this.workerPath = workerPath
    this.expectedOutputCount = 0
    this.workers = []
  }

  public createWorkers(num?: number): WorkerManager {
    const count = num === undefined ? noOfCores : num

    for (let i = 0; i < count; i += 1) {
      this.workers.push(
        childProcess.fork(this.workerPath, [], {
          silent: true,
        })
      )
    }

    return this
  }

  public stop(): WorkerManager {
    for (const worker of this.workers) {
      if (worker.connected) {
        worker.send({ stop: true })
      }
    }

    this.expectedOutputCount = 0
    this.workers.length = 0
    return this
  }

  public getCount(): number {
    return this.workers.length
  }
}

export default WorkerManager

import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import Result from '../@classes/Result'

const isDev = process.env.NODE_ENV === 'development'

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

  public addWorkerHandlers(callback: Function): WorkerManager {
    this.workers.forEach(worker => {
      worker.on('message', (data: { state: string; results: Result[] }) => {
        console.log(data, callback)

        // if (data.state === ProgressStateEnum.COMPLETED) {
        //   this.results.push(...data.results)
        //   if (this.results.length === this.expectedOutputCount) {
        //     const compiledResult = new CompiledResult()
        //     // repair prototype for objects
        //     this.results.forEach(result => {
        //       compiledResult.addResults(Result.fromJson(result))
        //     })
        //     callback({
        //       state: ProgressStateEnum.COMPLETED,
        //       compiledResult: compiledResult,
        //     })
        //   }
        // } else {
        //   callback(data)
        // }
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

      if (!isDev || !worker.stdout || !worker.stderr) {
        return
      }

      worker.stdout.on('data', (data: Buffer) => {
        electronLog.log(data.toString())
      })

      worker.stderr.on('data', (data: Buffer) => {
        electronLog.error(data.toString())
      })
    })

    return this
  }
}

export default WorkerManager

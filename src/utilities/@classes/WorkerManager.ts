import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import Callbacks from '../@interfaces/Callbacks'

class WorkerManager {
  public workerPath: string
  public receivedOutputCount: number
  public expectedOutputCount: number
  public workers: ChildProcess[]

  public constructor(workerPath: string) {
    this.workerPath = workerPath
    this.receivedOutputCount = 0
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

    this.receivedOutputCount = 0
    this.expectedOutputCount = 0
    this.workers.length = 0

    return this
  }

  public getCount(): number {
    return this.workers.length
  }

  public addWorkerHandlers(callbacks: Callbacks): void {
    this.workers.forEach(worker => {
      worker.on(
        'message',
        (message: { state: ProgressStateEnum; data: object }) => {
          if (message.state === ProgressStateEnum.COMPLETED) {
            this.receivedOutputCount += 1
          }

          if (this.receivedOutputCount === this.expectedOutputCount) {
            callbacks.onsuccess(message.data)
          } else {
            callbacks.onprogress(message.data)
          }
        }
      )

      worker.on('close', (code, signal) => {
        if (code) {
          electronLog.info(
            `process exited with code: ${code} and signal ${signal}`
          )
        } else {
          electronLog.info('process exited with code 0.')
        }

        if (callbacks.onclose)
          callbacks.onclose({ code: code || 0, singal: signal })
      })

      if (worker.stdout) {
        worker.stdout.on('data', (data: Buffer) => {
          electronLog.log(data.toString())

          if (callbacks.onlog) {
            callbacks.onlog({
              log: data.toString(),
            })
          }
        })
      }

      if (worker.stderr) {
        worker.stderr.on('data', (data: Buffer) => {
          electronLog.error(data.toString())

          if (callbacks.onerror) {
            callbacks.onerror({
              log: data.toString(),
            })
          }
        })
      }
    })
  }
}

export default WorkerManager

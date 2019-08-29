import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import Callbacks from '../@interfaces/Callbacks'

class WorkerManager {
  private _data: object[] = []

  public workerPath: string
  public receivedOutputCount: number
  public workers: ChildProcess[]

  public constructor(workerPath: string) {
    this.workerPath = workerPath
    this.receivedOutputCount = 0
    this.workers = []
  }

  public createWorkers(num?: number): WorkerManager {
    const count = num === undefined ? noOfCores : num

    this.stop()

    for (let i = 0; i < count; i += 1) {
      this.workers.push(
        childProcess.fork(this.workerPath, [], {
          detached: true,
          silent: true,
        })
      )
    }

    return this
  }

  public stop(): WorkerManager {
    for (const worker of this.workers) {
      worker.kill()
    }

    this.receivedOutputCount = 0
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
        (message: {
          state: ProgressStateEnum
          data?: object | object[]
          timeElapsed?: number
        }) => {
          if (message.state === ProgressStateEnum.PROGRESS) {
            callbacks.onprogress({
              timeElapsed: message.timeElapsed,
            })
          }

          if (message.state === ProgressStateEnum.COMPLETED) {
            this.receivedOutputCount += 1

            if (message.data) {
              console.log(
                message.data instanceof Array,
                typeof message.data,
                length in message.data
              )

              this._data.push()
            }
          }

          if (this.receivedOutputCount === this.getCount()) {
            callbacks.onsuccess({
              data: this._data,
            })
          }
        }
      )

      worker.on('disconnect', () => {
        electronLog.log('worker disconnect')
      })

      worker.on('exit', (code, signal) => {
        if (code) {
          electronLog.info(
            `worker exited with code: ${code} and signal ${signal}`
          )

          callbacks.onerror({
            code,
            signal,
          })
        } else {
          electronLog.info('worker exited with code 0.')
        }

        if (callbacks.onexit) {
          callbacks.onexit({ code: code || 0, signal: signal })
        }
      })

      worker.on('close', (code, signal) => {
        if (code) {
          electronLog.info(
            `worker closed with code: ${code} and signal ${signal}`
          )

          callbacks.onerror({
            code,
            signal,
          })
        } else {
          electronLog.info('worker closed with code 0.')
        }

        if (callbacks.onclose) {
          callbacks.onclose({ code: code || 0, signal: signal })
        }
      })

      worker.on('error', err => electronLog.error(err))

      if (worker.stdout) {
        worker.stdout.on('data', (data: Buffer) => {
          electronLog.log(data.toString())

          if (callbacks.onlog) {
            callbacks.onlog({
              data: data.toString(),
            })
          }
        })
      }

      if (worker.stderr) {
        worker.stderr.on('data', (data: Buffer) => {
          electronLog.error(data.toString())

          if (callbacks.onerror) {
            callbacks.onerror({
              data: data.toString(),
            })
          }
        })
      }
    })
  }
}

export default WorkerManager

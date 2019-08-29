import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import Callbacks from '../@interfaces/Callbacks'

class WorkerManager {
  private data: object[] = []
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
      const worker = childProcess.fork(this.workerPath, [], {
        detached: true,
        silent: true,
      })

      this.workers.push(worker)
    }

    return this
  }

  public stop(): WorkerManager {
    this.workers.forEach(worker => {
      worker.disconnect()
      worker.unref()
      worker.kill('SIGKILL')
    })

    this.receivedOutputCount = 0
    this.data.length = 0
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
          } else if (message.state === ProgressStateEnum.COMPLETED) {
            this.receivedOutputCount += 1

            if (message.data) {
              message.data instanceof Array
                ? this.data.push(...message.data)
                : this.data.push(message.data)
            }

            if (this.receivedOutputCount === this.getCount()) {
              //TODO: convert to appropriate data format

              callbacks.onsuccess({
                data: [...this.data],
              })

              this.stop()
            }
          }
        },
      )

      worker.on('disconnect', () => {
        electronLog.log('worker disconnect')
      })

      worker.on('exit', (code, signal) => {
        electronLog.info(
          `worker exited with code: ${code} and signal ${signal}`,
        )

        if (code) {
          callbacks.onerror({
            error: new Error('worker exit unexpectedly'),
            code,
            signal,
          })
        } else if (callbacks.onexit) {
          callbacks.onexit({ code: code || 0, signal: signal })
        }
      })

      worker.on('close', (code, signal) => {
        electronLog.info(
          `worker closed with code: ${code} and signal ${signal}`,
        )

        if (code) {
          callbacks.onerror({
            error: new Error('worker exit unexpectedly'),
            code,
            signal,
          })
        } else if (callbacks.onclose) {
          callbacks.onclose({ code: code || 0, signal: signal })
        }
      })

      worker.on('error', err => {
        callbacks.onerror({
          error: err,
        })
      })

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

          callbacks.onerror({
            error: data.toString(),
          })
        })
      }
    })
  }
}

export default WorkerManager

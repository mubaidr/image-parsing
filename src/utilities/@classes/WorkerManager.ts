import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import WorkerTypes from '../@enums/WorkerTypes'
import Callbacks from '../@interfaces/Callbacks'
import CompiledResult from './CompiledResult'
import Result from './Result'

class WorkerManager {
  private completed = 0
  private data: object[] = []
  public workers: ChildProcess[] = []
  public workerPath: string

  public constructor(workerPath: string) {
    this.workerPath = workerPath
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
      worker.unref()
      worker.kill('SIGKILL')
    })

    this.completed = 0
    this.data.length = 0
    this.workers.length = 0

    return this
  }

  public getWorkerCount(): number {
    return this.workers.length
  }

  public addWorkerHandlers(callbacks: Callbacks): void {
    this.workers.forEach(worker => {
      worker.on(
        'message',
        (message: {
          state: ProgressStateEnum
          timeElapsed: number
          workerType: WorkerTypes
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: any[]
        }) => {
          const { state, timeElapsed, workerType, data } = message

          if (state === ProgressStateEnum.PROGRESS) {
            return callbacks.onprogress({ timeElapsed })
          }

          if (state === ProgressStateEnum.COMPLETED) {
            this.completed += 1

            if (data) this.data.push(...data)
            if (this.completed !== this.getWorkerCount()) return

            if (
              workerType === WorkerTypes.EXTRACT ||
              workerType === WorkerTypes.COMPILE
            ) {
              const compiledResult = new CompiledResult()

              this.data.forEach(o => {
                compiledResult.add(Result.fromJson(o))
              })

              callbacks.onsuccess({
                data: compiledResult,
              })
            } else {
              callbacks.onsuccess({
                data: this.data,
              })
            }

            this.stop()
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
        electronLog.error(err)

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

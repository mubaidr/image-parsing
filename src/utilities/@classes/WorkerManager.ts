import childProcess, { ChildProcess } from 'child_process'
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
        silent: true,
      })

      this.workers.push(worker)
    }

    return this
  }

  public stop(): WorkerManager {
    this.workers.forEach(worker => {
      worker.kill('SIGKILL')
      worker.unref()
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
          data: any
        }) => {
          const { state, timeElapsed, workerType, data } = message

          if (state === ProgressStateEnum.PROGRESS) {
            callbacks.onprogress({ timeElapsed })

            return
          }

          if (state === ProgressStateEnum.COMPLETED) {
            this.completed += 1

            if (data) {
              if (data.length) this.data.push(...data)
              else this.data.push(data)
            }

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

      worker.on('exit', (code, signal) => {
        if (process.env.NODE_ENV === 'development') {
          console.info(
            `child_process exited. code: ${code || 0}, signal: ${signal}`,
          )
        }

        if (callbacks.onexit) callbacks.onexit(null)

        this.stop()
      })

      worker.on('error', err => {
        callbacks.onerror(err)

        this.stop()
      })

      if (worker.stdout) {
        worker.stdout.on('data', (data: Buffer) => {
          console.log(data.toString())
        })
      }

      if (worker.stderr) {
        worker.stderr.on('data', (data: Buffer) => {
          callbacks.onerror(data.toString())

          this.stop()
        })
      }
    })
  }
}

export default WorkerManager

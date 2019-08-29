import childProcess, { ChildProcess } from 'child_process'
import electronLog from 'electron-log'
import noOfCores from 'physical-cpu-count'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import Callbacks from '../@interfaces/Callbacks'
import ResultJson from '../@interfaces/ResultJson'
import CompiledResult from './CompiledResult'
import Result from './Result'
import WorkerManagerExtract from './WorkerManagerExtract'

class WorkerManager {
  private data: object[] = []
  private results: ResultJson[] = []
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
      worker.disconnect()
      worker.unref()
      worker.kill('SIGKILL')
    })

    this.data.length = 0
    this.results.length = 0
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
          timeElapsed?: number
          data?: object
          results?: ResultJson[]
        }) => {
          if (message.state === ProgressStateEnum.PROGRESS) {
            // onprogress callback with measured time
            callbacks.onprogress({
              timeElapsed: message.timeElapsed,
            })
          } else if (message.state === ProgressStateEnum.COMPLETED) {
            // insert data if any, otherwise insert empty to keep count
            this.data.push(message.data || {})

            // collect results if any
            if (message.results) {
              this.results.push(...message.results)
            }

            // if all workers have returned data
            if (this.data.length === this.getCount()) {
              // if extract worker we need to create compileResult object
              if (this instanceof WorkerManagerExtract) {
                const compiledResult = new CompiledResult()

                this.results.forEach(o => {
                  compiledResult.addResults(Result.fromJson(o))
                })

                callbacks.onsuccess({
                  data: compiledResult,
                })
              } else {
                // return the only object or complete array
                callbacks.onsuccess({
                  data: this.data.length === 1 ? this.data[0] : this.data,
                })
              }

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

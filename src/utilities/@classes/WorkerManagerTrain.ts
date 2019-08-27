import electronLog from 'electron-log'
import path from 'path'

import ProgressStateEnum from '../@enums/ProgressStateEnum'
import Callbacks from '../@interfaces/Callbacks'
import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerTrain extends WorkerManager {
  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerTrain.js')
      : path.resolve(__dirname, './workers/workerTrain.js')

    super(workerPath)
  }

  public addWorkerHandlers(callbacks: Callbacks): void {
    this.workers.forEach(worker => {
      worker.on(
        'message',
        (message: { state: ProgressStateEnum; data: object }) => {
          if (message.state === ProgressStateEnum.COMPLETED) {
            // TODO: extra count
            this.receivedOutputCount += 1
          }

          console.log(this.receivedOutputCount, this.getCount())

          if (this.receivedOutputCount === this.getCount()) {
            callbacks.onsuccess(message.data)
          } else {
            callbacks.onprogress(message.data)
          }
        }
      )

      worker.on('close', (a, b) => {
        if (a) {
          electronLog.info(
            `child process exited with code: ${a} and signal ${b}`
          )
        } else {
          electronLog.info('child process exited with code 0.')
        }

        if (callbacks.onclose) callbacks.onclose({ code: a || 0, singal: b })
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

  public process(options: WorkerManagerInput): WorkerManagerOutput {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode
    )

    const { callbacks, data } = options
    const { designData, resultPath, keyPath } = data

    this.createWorkers(1)
    this.addWorkerHandlers(callbacks)
    this.receivedOutputCount = 1
    this.workers[0].send({
      designData,
      resultPath,
      keyPath,
    })

    return { totalWorkers: 1 }
  }
}

export default WorkerManagerTrain

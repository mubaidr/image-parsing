import path from 'path'

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

  public process(options: WorkerManagerInput): WorkerManagerOutput {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode
    )

    const { callback, data } = options
    const { designData, resultPath, keyPath } = data

    if (!resultPath) throw 'Invalid resultPath...'
    if (!keyPath) throw 'Invalid keyPath...'

    this.createWorkers(1)
      .addWorkerHandlers(callback)
      .workers[0].send({
        designData,
        resultPath,
        keyPath,
      })

    this.expectedOutputCount = 1

    return { totalWorkers: 1 }
  }
}

export default WorkerManagerTrain

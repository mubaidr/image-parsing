import path from 'path'

import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import WorkerManager from './WorkerManager'

// const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerTrain extends WorkerManager {
  constructor() {
    const workerPath = path.resolve('./dist/workers/workerTrain.js')

    super(workerPath)
  }

  public process(options: WorkerManagerInput): WorkerManagerOutput {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode
    )

    const { callbacks, data } = options
    const { designData, resultPath, keyPath } = data
    const totalWorkers = 1

    if (!resultPath) throw new Error('Invalid resultPath...')
    if (!keyPath) throw new Error('Invalid keyPath...')

    this.createWorkers(totalWorkers)
    this.addWorkerHandlers(callbacks)

    this.workers[0].send({
      designData,
      resultPath,
      keyPath,
    })

    return { totalWorkers, totalOutput: totalWorkers }
  }
}

export default WorkerManagerTrain

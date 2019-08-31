import path from 'path'

import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerGenerateTestData extends WorkerManager {
  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerGenerateTestData.js')
      : path.resolve(__dirname, './workers/workerGenerateTestData.js')

    super(workerPath)
  }

  public process(options: WorkerManagerInput): WorkerManagerOutput {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode,
    )

    const { callbacks, data } = options
    const { designData, resultPath, imagesDirectory, exportDirectory } = data

    if (!resultPath) throw 'Invalid resultPath...'
    if (!imagesDirectory) throw 'Invalid imagesDirectory...'
    if (!exportDirectory) throw 'Invalid exportDirectory...'

    console.log(
      callbacks,
      designData,
      resultPath,
      imagesDirectory,
      exportDirectory,
    )

    return { totalWorkers: 0 }
  }
}

export default WorkerManagerGenerateTestData

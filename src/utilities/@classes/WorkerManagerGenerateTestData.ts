import path from 'path'
import noOfCores from 'physical-cpu-count'

import CompiledResult from '../@classes/CompiledResult'
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
    const {
      designData,
      resultPath,
      imagesDirectory,
      exportDirectory,
      percentOfFiles,
    } = data

    if (!resultPath) throw 'Invalid resultPath...'
    if (!imagesDirectory) throw 'Invalid imagesDirectory...'
    if (!exportDirectory) throw 'Invalid exportDirectory...'

    const results = CompiledResult.loadFromExcel(resultPath).getRandomResults(
      percentOfFiles,
    )

    const totalWorkers = Math.min(results.length, noOfCores)
    const step = Math.floor(results.length / totalWorkers)

    this.createWorkers(totalWorkers)
    this.addWorkerHandlers(callbacks)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex = i === totalWorkers - 1 ? results.length : (i + 1) * step

      this.workers[i].send({
        designData,
        results: results.slice(startIndex, endIndex),
        imagesDirectory,
        exportDirectory,
      })
    }

    return { totalWorkers, totalOutput: results.length }
  }
}

export default WorkerManagerGenerateTestData

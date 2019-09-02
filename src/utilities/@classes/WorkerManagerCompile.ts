import path from 'path'
import noOfCores from 'physical-cpu-count'

import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { readKey } from '../index'
import CompiledResult from './CompiledResult'
import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerTrain extends WorkerManager {
  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerCompile.js')
      : path.resolve(__dirname, './workers/workerCompile.js')

    super(workerPath)
  }

  public async process(
    options: WorkerManagerInput,
  ): Promise<WorkerManagerOutput> {
    const { callbacks, data } = options
    const { resultPath, keyPath, correctMarks, incorrectMarks } = data

    if (!resultPath) throw 'Invalid resultPath...'
    if (!keyPath) throw 'Invalid keyPath...'
    if (!correctMarks) throw 'Invalid correctMarks...'
    if (!incorrectMarks) throw 'Invalid incorrectMarks...'

    const results = CompiledResult.loadFromExcel(resultPath).getResults()
    const keys = await readKey(keyPath)

    const totalWorkers = Math.min(results.length, noOfCores)
    const step = Math.floor(results.length / totalWorkers)

    this.createWorkers(totalWorkers)
    this.addWorkerHandlers(callbacks)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex = i === totalWorkers - 1 ? results.length : (i + 1) * step

      this.workers[i].send({
        results: results.slice(startIndex, endIndex),
        keys,
        correctMarks,
        incorrectMarks,
      })
    }

    return {
      totalWorkers,
      totalOutput: results.length + (keys ? keys.length : 0),
    }
  }
}

export default WorkerManagerTrain

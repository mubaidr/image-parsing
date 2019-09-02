import path from 'path'
import noOfCores from 'physical-cpu-count'

import WorkerManagerInput from '../@interfaces/WorkerManagerInput'
import WorkerManagerOutput from '../@interfaces/WorkerManagerOutput'
import { dataPaths } from '../dataPaths'
import { getDesignData } from '../design'
import { getImagePaths } from '../images'
import WorkerManager from './WorkerManager'

const isDev = process.env.NODE_ENV === 'development'

class WorkerManagerExtract extends WorkerManager {
  constructor() {
    const workerPath = isDev
      ? path.resolve('./dist/workers/workerExtract.js')
      : path.resolve(__dirname, './workers/workerExtract.js')

    super(workerPath)
  }

  public async process(
    options: WorkerManagerInput,
  ): Promise<WorkerManagerOutput> {
    options.data.designData = getDesignData(
      options.designPath || dataPaths.designBarcode,
    )

    const { callbacks, data } = options
    const { designData, imagesDirectory } = data

    if (!imagesDirectory) throw 'Invalid imagesDirectory...'

    const totalImages = await getImagePaths(imagesDirectory)
    const totalWorkers = Math.min(totalImages.length, noOfCores)
    const step = Math.floor(totalImages.length / totalWorkers)

    this.createWorkers(totalWorkers)
    this.addWorkerHandlers(callbacks)

    for (let i = 0; i < totalWorkers; i += 1) {
      const startIndex = i * step
      const endIndex =
        i === totalWorkers - 1 ? totalImages.length : (i + 1) * step

      this.workers[i].send({
        designData,
        imagePaths: totalImages.slice(startIndex, endIndex),
      })
    }

    return { totalWorkers, totalOutput: totalImages.length }
  }
}

export default WorkerManagerExtract

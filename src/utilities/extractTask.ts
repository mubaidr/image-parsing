import WorkerManager from './@classes/WorkerManager'
import ProgressStateEnum from './@enums/ProgressStateEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { startTask } from './workers/extractTaskWorker'
import WorkerTypesEnum from './@enums/WorkerTypesEnum'

let workerManager: WorkerManager

const start = async (
  callback: (data: object) => void,
  imagesPath: string,
  inProcess: boolean = false
): Promise<{
  totalImages: number
  totalWorkers: number
}> => {
  const [designData, images] = await Promise.all([
    getDesignData(dataPaths.designBarcode),
    getImagePaths(imagesPath),
  ])
  workerManager = new WorkerManager(WorkerTypesEnum.EXTRACT)

  if (inProcess) {
    startTask(designData, images).then(results => {
      callback({
        state: ProgressStateEnum.COMPLETED,
        results: results,
      })
    })

    return {
      totalImages: images.length,
      totalWorkers: 1,
    }
  } else {
    return workerManager.process(designData, images, callback)
  }
}

const stop = () => {
  if (workerManager) workerManager.reset()
}

export { start, stop }

import WorkerManager from './@classes/WorkerManager'
import dataPaths from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { processTask } from './processTaskWorker'

let workerManager: WorkerManager

const start = async (
  callback: (data: object) => void,
  path: string,
  inProcess: boolean
): Promise<{
  totalImages: number
  totalWorkers: number
}> => {
  const [designData, images] = await Promise.all([
    getDesignData(dataPaths.designBarcode),
    getImagePaths(path),
  ])
  workerManager = new WorkerManager()

  if (inProcess) {
    processTask(designData, images).then(compiledResult => {
      callback({
        completed: true,
        compiledResult: compiledResult,
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

const stop = async () => {
  if (workerManager) workerManager.reset()
}

export { start, stop }


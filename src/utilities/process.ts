import WorkerManager from './@classes/WorkerManager'
import dataPaths from './dataPaths'
import { getDesignData } from './design'
import { getImagePaths } from './images'
import { processTask } from './processTaskWorker'

let workerManager: WorkerManager

const start = async (
  callback: (data: object) => void,
  path: string,
  isFile: boolean,
  inProcess: boolean
): Promise<{
  totalImages: number
  totalWorkers: number
}> => {
  workerManager = new WorkerManager()
  const designData = await getDesignData(dataPaths.designBarcode)
  const images = isFile ? [path] : await getImagePaths(path)

  if (inProcess) {
    processTask(designData, images).then(res => {
      callback({
        completed: true,
        results: res,
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
  workerManager.reset()
}

export { start, stop }

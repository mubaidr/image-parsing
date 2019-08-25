import WorkerManager from './@classes/WorkerManager'

let workerManager: WorkerManager

const startTask = async (
  callback: (data: object) => void,
  imagesPath: string,
  inProcess: boolean = false
) => {
  const [designData, images] = await Promise.all([
    getDesignData(dataPaths.designBarcode),
    getImagePaths(path),
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

const stopTask = () => {
  if (workerManager) workerManager.reset()
}

export { startTask, stopTask }

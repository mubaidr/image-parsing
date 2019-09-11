// import path from 'path'
import WorkerManagerTrain from '../src/utilities/@classes/WorkerManagerTrain'
import { dataPaths } from '../src/utilities/dataPaths'
import { getDesignData } from '../src/utilities/design'

async function start() {
  const wm = new WorkerManagerTrain()
  const designData = getDesignData(dataPaths.designBarcode)

  const { totalWorkers, totalOutput } = wm.process({
    designPath: dataPaths.designBarcode,
    data: {
      designData,
      resultPath: dataPaths.result,
      keyPath: dataPaths.key,
    },
    callbacks: {
      onsuccess: console.info,
      onerror: console.error,
      onprogress: console.info,
      onlog: console.log,
    },
  })

  console.log(totalWorkers, totalOutput)
}

start()

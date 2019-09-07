import childProcess from 'child_process'
import treeKill from 'tree-kill'

import WorkerManagerTrain from '../../../src/utilities/@classes/WorkerManagerTrain'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

beforeAll(() => {
  childProcess.execSync('node _scripts/dev-runner-worker.js train')
})

describe('WorkerManagerTrain', () => {
  const wm = new WorkerManagerTrain()

  test('should initiate successfuly', async () => {
    expect.assertions(4)

    return new Promise((resolve): void => {
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn()
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        wm.workers.forEach(worker => {
          treeKill(worker.pid)
        })

        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onerror).toHaveBeenCalledTimes(0)
        // expect(onprogress).toHaveBeenCalled()
        expect(onsuccess).toHaveBeenCalledTimes(1)

        resolve()
      })

      wm.process({
        designPath: dataPaths.designBarcode,
        data: {
          designData,
          imagesDirectory: dataPaths.imagesBarcode,
          resultPath: dataPaths.result,
          keyPath: dataPaths.key,
        },
        callbacks: {
          onsuccess,
          onerror,
          onprogress,
        },
      }).then(({ totalWorkers }) => {
        expect(totalWorkers).toBeGreaterThanOrEqual(1)
      })
    })
  })
})

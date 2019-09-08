import childProcess from 'child_process'
import treeKill from 'tree-kill'

import WorkerManagerTrain from '../../../src/utilities/@classes/WorkerManagerTrain'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

beforeAll(() => {
  childProcess.execSync('node _scripts/dev-runner-worker.js train')
  // jest.setTimeout(30000)
})

afterAll(() => {
  // jest.setTimeout(5000)
})

describe('WorkerManagerTrain', () => {
  const wm = new WorkerManagerTrain()

  test('should initiate successfuly', async () => {
    /*
    expect.assertions(5)

    return new Promise((resolve): void => {
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn()
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onerror).toHaveBeenCalledTimes(0)
        expect(onsuccess).toHaveBeenCalledTimes(1)

        wm.workers.forEach(worker => {
          treeKill(worker.pid)
        })

        resolve()
      })

      wm.process({
        designPath: dataPaths.designBarcode,
        data: {
          designData,
          resultPath: dataPaths.result,
          keyPath: dataPaths.key,
        },
        callbacks: {
          onsuccess,
          onerror,
          onprogress,
        },
      }).then(({ totalWorkers, totalOutput }) => {
        expect(totalWorkers).toBe(1)
        expect(totalOutput).toBe(1)
      })
    })

  */
  })
})

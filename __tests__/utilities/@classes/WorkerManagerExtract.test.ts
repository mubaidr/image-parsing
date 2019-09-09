import childProcess from 'child_process'
import treeKill from 'tree-kill'

import WorkerManagerExtract from '../../../src/utilities/@classes/WorkerManagerExtract'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

beforeAll(() => {
  childProcess.execSync('node _scripts/dev-runner-worker.js extract')
  jest.setTimeout(30000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

describe('WorkerManagerExtract', () => {
  const wm = new WorkerManagerExtract()

  test('should initiate successfuly', async () => {
    expect.assertions(6)

    return new Promise((resolve): void => {
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn()
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onerror).toHaveBeenCalledTimes(0)
        expect(onprogress).toHaveBeenCalled()
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
          imagesDirectory: dataPaths.imagesBarcode,
        },
        callbacks: {
          onsuccess,
          onerror,
          onprogress,
        },
      }).then(({ totalWorkers, totalOutput }) => {
        expect(totalWorkers).toBeGreaterThanOrEqual(1)
        expect(totalOutput).toBeGreaterThanOrEqual(1)
      })
    })
  })
})

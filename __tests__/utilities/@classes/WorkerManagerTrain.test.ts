import childProcess from 'child_process'

import WorkerManagerTrain from '../../../src/utilities/@classes/WorkerManagerTrain'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

beforeAll(() => {
  childProcess.execSync('node _scripts/dev-runner-worker.js train')
  jest.setTimeout(30000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

describe('WorkerManagerTrain', () => {
  const wm = new WorkerManagerTrain()

  test('should initiate successfuly', async () => {
    expect.assertions(5)

    return new Promise((resolve): void => {
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn()
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onerror).toHaveBeenCalledTimes(0)
        expect(onsuccess).toHaveBeenCalledTimes(1)

        resolve()
      })

      const { totalWorkers, totalOutput } = wm.process({
        designPath: dataPaths.designBarcode,
        data: {
          designData,
          resultPath: dataPaths.result,
          keyPath: dataPaths.keyImage,
        },
        callbacks: {
          onsuccess: console.info,
          onerror: console.error,
          onprogress: console.info,
          onlog: console.log,
        },
      })

      expect(totalWorkers).toBe(1)
      expect(totalOutput).toBe(1)
    })
  })
})

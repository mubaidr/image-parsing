import WorkerManagerTrain from '../../../src/utilities/@classes/WorkerManagerTrain'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

beforeAll(() => {
  // childProcess.execSync('node _scripts/dev-runner-worker.js train')
  jest.setTimeout(15000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

describe('WorkerManagerTrain', () => {
  test('should initiate successfuly', async () => {
    expect.assertions(5)

    return new Promise((resolve): void => {
      const wm = new WorkerManagerTrain()
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn(err => {
        wm.stop()
        fail(err)
      })
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onprogress).not.toHaveBeenCalled()
        expect(onsuccess).toHaveBeenCalledTimes(1)

        resolve()
      })

      const { totalWorkers, totalOutput } = wm.process({
        designPath: dataPaths.designBarcode,
        data: {
          designData,
          resultPath: dataPaths.key,
          keyPath: dataPaths.keyImage,
        },
        callbacks: {
          onsuccess,
          onprogress,
          onerror,
        },
      })

      expect(totalWorkers).toBe(1)
      expect(totalOutput).toBe(1)
    })
  })
})

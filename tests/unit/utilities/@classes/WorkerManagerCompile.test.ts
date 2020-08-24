import WorkerManagerCompile from '../../../../src/utilities/@classes/WorkerManagerCompile'
import { dataPaths } from '../../../../src/utilities/dataPaths'
import { getDesignData } from '../../../../src/utilities/design'

beforeAll(() => {
  // childProcess.execSync('node _scripts/dev-runner-worker.js compile')
  jest.setTimeout(15000)
})

afterAll(() => {
  jest.setTimeout(5000)
})

describe('WorkerManagerCompile', () => {
  test('should initiate successfuly', async () => {
    expect.assertions(5)

    return new Promise((resolve): void => {
      const wm = new WorkerManagerCompile()
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn((err) => {
        wm.stop()
        fail(err)
      })
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onprogress).toHaveBeenCalled()
        expect(onsuccess).toHaveBeenCalledTimes(1)

        resolve()
      })

      wm.process({
        designPath: dataPaths.designBarcode,
        data: {
          designData,
          resultPath: dataPaths.result,
          keyPath: dataPaths.key,
          correctMarks: 3,
          incorrectMarks: 1,
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

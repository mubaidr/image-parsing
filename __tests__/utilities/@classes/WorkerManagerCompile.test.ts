import WorkerManagerCompile from '../../../src/utilities/@classes/WorkerManagerCompile'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'

describe('WorkerManagerCompile', () => {
  test('should initiate successfuly', async () => {
    expect.assertions(6)

    return new Promise((resolve): void => {
      const wm = new WorkerManagerCompile()
      const designData = getDesignData(dataPaths.designBarcode)

      const onerror = jest.fn()
      const onprogress = jest.fn()
      const onsuccess = jest.fn(() => {
        expect(wm.getWorkerCount()).toBeGreaterThanOrEqual(1)
        expect(onerror).toHaveBeenCalledTimes(0)
        expect(onprogress).toHaveBeenCalled()
        expect(onsuccess).toHaveBeenCalledTimes(1)

        //TODO: call wm.stop() after each test, kill processes using kill-tree
        wm.stop()
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

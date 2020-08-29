import { dataPaths } from '@/utilities/dataPaths'
import {
  PROGRESS_STATES,
  // eslint-disable-next-line prettier/prettier
  WorkerManager
} from '../../../../src/utilities/@classes/WorkerManager'

describe('WorkerManager', () => {
  test('should be able to extract using workers', async (done) => {
    expect.assertions(6)

    return new Promise((resolve) => {
      const workerManager = new WorkerManager()
      const logCallback = jest.fn()
      const errorCallback = jest.fn()
      const progressCallback = jest.fn()
      const completeCallback = jest.fn()

      return workerManager
        .on(PROGRESS_STATES.LOG, logCallback)
        .on(PROGRESS_STATES.ERROR, errorCallback)
        .on(PROGRESS_STATES.PROGRESS, progressCallback)
        .on(PROGRESS_STATES.COMPLETED, completeCallback)
        .on(PROGRESS_STATES.COMPLETED, (data) => {
          expect(workerManager.inputCount).toBe(3)
          expect(data.length).toBe(3)
          expect(logCallback).toBeCalledTimes(0)
          expect(errorCallback).toBeCalledTimes(0)
          expect(progressCallback).toBeCalledTimes(3)
          expect(completeCallback).toBeCalledTimes(1)

          workerManager.stop()
          done()
          resolve()
        })
        .extract(dataPaths.imagesBarcode, 'barcode')
    })
  })

  test('should be able to compile using workers', () => {})

  test('should be able to generate using workers', () => {})
})

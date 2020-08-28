import { dataPaths } from '@/utilities/dataPaths'
import {
  PROGRESS_STATES,
  // eslint-disable-next-line prettier/prettier
  WorkerManager
} from '../../../../src/utilities/@classes/WorkerManager'

describe('WorkerManager', () => {
  test('should be able to extract using workers', async () => {
    const workerManager = new WorkerManager()
    const progressCallback = jest.fn()
    const successCallback = jest.fn()

    // BUG: worker files not compiled into js

    workerManager.on(PROGRESS_STATES.PROGRESS, (message) => {
      expect(message.progressState).toBe(PROGRESS_STATES.PROGRESS)
      expect(message.data).toBeUndefined()
      progressCallback()
    })

    workerManager.on(PROGRESS_STATES.SUCCESS, (message) => {
      expect(message.progressState).toBe(PROGRESS_STATES.SUCCESS)
      expect(message.data.length).toBeGreaterThanOrEqual(3)
      successCallback()
    })

    workerManager.on('error', (error) => {
      console.error(error)
    })

    workerManager.on('log', (log) => {
      console.log(log)
    })

    await workerManager
      .extract(dataPaths.imagesBarcode, 'barcode')
      .then(() => {
        expect(workerManager.inputCount).toBe(3)
        expect(successCallback).toBeCalledTimes(1)
        expect(progressCallback).toBeCalledTimes(3)
      })
      .catch((err) => {
        fail(err)
      })
      .then(() => {
        workerManager.stop()
      })
  })

  test('should be able to compile using workers', () => {})

  test('should be able to generate using workers', () => {})
})

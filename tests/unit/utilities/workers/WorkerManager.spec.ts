import { dataPaths } from '@/utilities/dataPaths'
import {
  PROGRESS_STATES,
  // eslint-disable-next-line prettier/prettier
  WorkerManager
} from '@/utilities/workers/WorkerManager'

const workerManager = new WorkerManager()

afterEach(() => {
  workerManager.stop()
})

describe('WorkerManager', () => {
  test('should be able to extract using workers', async () => {
    expect.assertions(6)

    const logCallback = jest.fn()
    const errorCallback = jest.fn()
    const progressCallback = jest.fn()
    const completeCallback = jest.fn()

    const data = await workerManager
      .on(PROGRESS_STATES.LOG, logCallback)
      .on(PROGRESS_STATES.ERROR, errorCallback)
      .on(PROGRESS_STATES.PROGRESS, progressCallback)
      .on(PROGRESS_STATES.COMPLETE, completeCallback)
      .extract(dataPaths.imagesBarcode, 'barcode')

    expect(workerManager.inputCount).toBe(3)
    expect(data.length).toBe(3)
    expect(logCallback).toBeCalledTimes(0)
    expect(errorCallback).toBeCalledTimes(0)
    expect(progressCallback).toBeCalledTimes(3)
    expect(completeCallback).toBeCalledTimes(1)
  })

  test('should be able to compile using workers', async () => {
    expect.assertions(6)

    const logCallback = jest.fn()
    const errorCallback = jest.fn()
    const progressCallback = jest.fn()
    const completeCallback = jest.fn()

    const data = await workerManager
      .on(PROGRESS_STATES.LOG, logCallback)
      .on(PROGRESS_STATES.ERROR, errorCallback)
      .on(PROGRESS_STATES.PROGRESS, progressCallback)
      .on(PROGRESS_STATES.COMPLETE, completeCallback)
      .compile(dataPaths.result, dataPaths.key)

    expect(workerManager.inputCount).toBe(3)
    expect(data.length).toBe(3)
    expect(logCallback).toBeCalledTimes(0)
    expect(errorCallback).toBeCalledTimes(0)
    expect(progressCallback).toBeCalledTimes(3)
    expect(completeCallback).toBeCalledTimes(1)
  })

  test('should be able to generate using workers', () => {})
})

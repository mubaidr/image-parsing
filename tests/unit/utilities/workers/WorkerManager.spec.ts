import { dataPaths } from '@/utilities/dataPaths'
import { PROGRESS_STATES } from '@/utilities/workers/PROGRESS_STATES'
import { WorkerManager } from '@/utilities/workers/WorkerManager'

jest.setTimeout(10000)

const workerManager = new WorkerManager()

describe('WorkerManager', () => {
  test('should be able to extract using workers', async () => {
    expect.assertions(5)

    const logCallback = jest.fn()
    const errorCallback = jest.fn()
    const progressCallback = jest.fn()
    const completeCallback = jest.fn()

    const data = await workerManager
      .on(PROGRESS_STATES.LOG, logCallback)
      .on(PROGRESS_STATES.ERROR, errorCallback)
      .on(PROGRESS_STATES.PROGRESS, progressCallback)
      .on(PROGRESS_STATES.COMPLETE, completeCallback)
      .extract(dataPaths.imagesBarcode, dataPaths.designBarcode)

    if (!data) fail()

    expect(data.length).toBe(4)
    expect(logCallback).toBeCalledTimes(0)
    expect(errorCallback).toBeCalledTimes(0)
    expect(progressCallback).toBeCalledTimes(4)
    expect(completeCallback).toBeCalledTimes(1)
  })

  test('should be able to compile using workers', async () => {
    expect.assertions(5)

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

    if (!data) fail()

    expect(data.length).toBe(4)
    expect(logCallback).toBeCalledTimes(0)
    expect(errorCallback).toBeCalledTimes(0)
    expect(progressCallback).toBeCalledTimes(1)
    expect(completeCallback).toBeCalledTimes(1)
  })

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test('should be able to generate using workers', () => {})
})

import WorkerManager from '../../../src/utilities/@classes/WorkerManager'

describe('WorkerManager', () => {
  test('should be defined', () => {
    const workerManager = new WorkerManager('')

    expect(workerManager.getWorkerCount()).toBe(0)
    expect(workerManager.workerPath).toBe('')
  })
})

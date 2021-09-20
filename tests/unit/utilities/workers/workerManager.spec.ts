import { DataPaths } from '/@/utilities/dataPaths';
import { ProgressStates } from '/@/utilities/workers/ProgressStates';
import { WorkerManager } from '/@/utilities/workers/workerManager';

jest.setTimeout(10000);

const workerManager = new WorkerManager();

describe('WorkerManager', () => {
  test('should be able to extract using workers', async () => {
    expect.assertions(5);

    const logCallback = jest.fn();
    const errorCallback = jest.fn();
    const progressCallback = jest.fn();
    const completeCallback = jest.fn();

    const data = await workerManager
      .on(ProgressStates.Log, logCallback)
      .on(ProgressStates.Error, errorCallback)
      .on(ProgressStates.Progress, progressCallback)
      .on(ProgressStates.Complete, completeCallback)
      .extract(DataPaths.imagesBarcode, DataPaths.designBarcode);

    if (!data) fail();

    expect(data.length).toBe(4);
    expect(logCallback).toBeCalledTimes(0);
    expect(errorCallback).toBeCalledTimes(0);
    expect(progressCallback).toBeCalledTimes(4);
    expect(completeCallback).toBeCalledTimes(1);
  });

  test('should be able to compile using workers', async () => {
    expect.assertions(5);

    const logCallback = jest.fn();
    const errorCallback = jest.fn();
    const progressCallback = jest.fn();
    const completeCallback = jest.fn();

    const data = await workerManager
      .on(ProgressStates.Log, logCallback)
      .on(ProgressStates.Error, errorCallback)
      .on(ProgressStates.Progress, progressCallback)
      .on(ProgressStates.Complete, completeCallback)
      .compile(DataPaths.result, DataPaths.key);

    if (!data) fail();

    expect(data.length).toBe(4);
    expect(logCallback).toBeCalledTimes(0);
    expect(errorCallback).toBeCalledTimes(0);
    expect(progressCallback).toBeCalledTimes(1);
    expect(completeCallback).toBeCalledTimes(1);
  });

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  test('should be able to generate using workers', () => {});
});

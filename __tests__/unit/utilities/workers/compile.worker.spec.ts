import { DataPaths } from '@/utilities/dataPaths';
import { readKey } from '@/utilities/readKey';
import { start } from '@/utilities/workers/compile.worker';

describe('workerCompile', () => {
  test('should compile just fine', async () => {
    const keys = await readKey(DataPaths.key);

    if (!keys) fail();

    const compiledResult = await start(
      {
        resultPath: DataPaths.result,
        keys,
        correctMarks: 3,
        incorrectMarks: 1,
      },
      false,
    );

    if (!compiledResult) fail();

    expect(compiledResult.keys.length).toBeGreaterThanOrEqual(1);
    expect(compiledResult.results.length).toBeGreaterThanOrEqual(3);

    compiledResult.sortResults().results.forEach((result) => {
      expect(result).toMatchSnapshot({
        id: expect.any(String),
        filePath: expect.any(String),
      });
    });
  });
});

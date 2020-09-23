import { dataPaths } from '@/utilities/dataPaths'
import { start } from '@/utilities/workers/compile.worker'

describe('workerCompile', () => {
  test('should compile just fine', async () => {
    const compiledResult = await start(
      {
        resultPath: dataPaths.result,
        keyPath: dataPaths.key,
      },
      false
    )

    if (!compiledResult) fail()

    expect(compiledResult.keys.length).toBeGreaterThanOrEqual(1)
    expect(compiledResult.results.length).toBeGreaterThanOrEqual(3)

    compiledResult.results.forEach((result) => {
      expect(result).toMatchSnapshot({
        id: expect.any(String),
        filePath: expect.any(String),
      })
    })
  })
})

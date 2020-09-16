import { CompiledResult } from '@/utilities/CompiledResult'
import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'
import { start } from '@/utilities/workers/compile.worker'

describe('workerCompile', () => {
  test('should compile just fine', async () => {
    const results = CompiledResult.loadFromExcel(dataPaths.result).getResults()
    const keys = await readKey(dataPaths.key)

    if (!keys) fail()

    const compiledResult = await start(
      {
        results,
        keys,
      },
      false
    )

    expect(compiledResult).toBeDefined()
    expect(compiledResult?.getKeyCount()).toBeGreaterThanOrEqual(1)
    expect(compiledResult?.getResultCount()).toBeGreaterThanOrEqual(3)
  })
})

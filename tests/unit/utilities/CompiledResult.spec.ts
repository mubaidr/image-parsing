import { CompiledResult } from '@/utilities/CompiledResult'
import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'

describe('CompiledResult', () => {
  test('should be able to load from excel', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled
    )
    const key = await readKey(dataPaths.key)

    expect(compiledResult.keys.length).toBe(0)
    expect(compiledResult.results.length).toBeGreaterThanOrEqual(3)
    expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(3)

    if (key) {
      compiledResult.addKeys(key)

      expect(compiledResult.keys.length).toBe(1)
      expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(
        4
      )
    }
  })

  test('should be able to sort results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled
    )

    expect(compiledResult.sortResults().results.reverse()).not.toThrow()
  })

  test('should be able to merge two compiled Results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled
    )

    const compiledResult2 = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled
    )

    const compiledResultCombined = CompiledResult.merge([
      compiledResult,
      compiledResult2,
    ])

    expect(compiledResultCombined.results.length).toBeGreaterThanOrEqual(6)
  })

  test('should be able to addResults', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled
    )

    const compiledResultKey = new CompiledResult()

    compiledResultKey.addResults([compiledResult.results[0]])

    expect(compiledResultKey.results.length).toBe(1)

    compiledResultKey.addResults(compiledResult.results)

    expect(compiledResultKey.results.length).toBe(3)
  })

  test('should be able to compile results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const keys = await readKey(dataPaths.key)

    if (!keys) fail()

    compiledResult.addKeys(keys).compile(3, 1)

    compiledResult.results.forEach((result) => {
      expect(result.totalMarks).toBeGreaterThan(0)
    })
  })
})

import CompiledResult from '../../../src/utilities/@classes/CompiledResult'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { readKey } from '../../../src/utilities/readKey'

describe('CompiledResult', () => {
  test('should be defined', () => {
    const compiledResult = new CompiledResult()

    expect(compiledResult).toBeDefined()
  })

  test('should have default values set', async () => {
    const compiledResult = new CompiledResult()

    expect(compiledResult.getKeyCount()).toBe(0)
    expect(compiledResult.getResultCount()).toBe(0)
    expect(compiledResult.getKeys().length).toBe(0)
    expect(compiledResult.getResults().length).toBe(0)
  })

  test('should be able to load from excel', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )
    const key = await readKey(dataPaths.key)

    expect(compiledResult.getKeyCount()).toBe(0)
    expect(compiledResult.getResultCount()).toBeGreaterThanOrEqual(3)
    expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(3)

    if (key) {
      compiledResult.addKeys(key)

      expect(compiledResult.getKeyCount()).toBe(1)
      expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(
        4,
      )
    }
  })

  test('should be able to add key from excel', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    expect(compiledResult.getKeyCount()).toBe(0)
    expect(compiledResult.getResultCount()).toBeGreaterThanOrEqual(3)
    expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(3)

    compiledResult.addFromExcel(dataPaths.key)

    expect(compiledResult.getKeyCount()).toBe(1)
    expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(4)
  })

  test('should be able to add results from excel', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.key)

    expect(compiledResult.getKeyCount()).toBe(1)
    expect(compiledResult.getResultCount()).toBe(0)
    expect(compiledResult.getKeysAndResults().length).toBe(1)

    compiledResult.addFromExcel(dataPaths.result)

    expect(compiledResult.getKeyCount()).toBe(1)
    expect(compiledResult.getResultCount()).toBeGreaterThanOrEqual(3)
    expect(compiledResult.getKeysAndResults().length).toBeGreaterThanOrEqual(4)
  })

  test('should be able to sort results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    compiledResult.sortResults()

    expect(compiledResult.getResults()[0].rollNo).toBeUndefined()

    compiledResult.reverseResults()

    const results = compiledResult.getResults()

    expect(results[0].rollNo).toBeDefined()
  })

  test('should be able to merge two compiled Results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    const compiledResult2 = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    expect(compiledResult.getResultCount()).toBeGreaterThanOrEqual(3)
    expect(compiledResult2.getResultCount()).toBeGreaterThanOrEqual(3)

    const compiledResultCombined = CompiledResult.merge([
      compiledResult,
      compiledResult2,
    ])

    expect(compiledResultCombined.getResultCount()).toBeGreaterThanOrEqual(6)
  })

  test('should return random number of results from collection', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    expect(compiledResult.getRandomResults(50).length).toBeGreaterThanOrEqual(1)
  })

  test('should be able to addResults', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    const compiledResultKey = new CompiledResult()

    compiledResultKey.addResults(compiledResult.getResults()[0])

    expect(compiledResultKey.getResultCount()).toBe(1)

    compiledResultKey.addResults(compiledResult.getResults())

    expect(compiledResult.getResultCount()).toBeGreaterThanOrEqual(3)
  })

  test('should be able to export as obj array', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    const d = compiledResult.export()
    expect(d).toMatchSnapshot()
  })

  test('should be able to export as obj array from static method', async () => {
    const compiledResult = CompiledResult.loadFromExcel(
      dataPaths.resultCompiled,
    )

    const d = CompiledResult.export(compiledResult)
    expect(d).toMatchSnapshot()
  })

  test('should be able to compile results', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)

    compiledResult.addFromExcel(dataPaths.key).compile(3, 1)

    compiledResult.getResults().forEach(result => {
      expect(result.getTotalMarks()).toBeGreaterThan(0)
    })
  })
})

import { CompiledResult } from '@/utilities/CompiledResult'
import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'
import { Result } from '@/utilities/Result'
import path from 'path'

describe('Result', () => {
  test('should have defaults set', async () => {
    const rollNo = '10023'
    const imageFile = path.resolve(dataPaths.imagesBarcode, '10023.jpg')
    const result = new Result(rollNo, imageFile)

    expect(result.id).toBeDefined()
    expect(result.rollNo).toBe(rollNo)
    expect(result.imageFile).toBe(imageFile)
  })

  test('should compile', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.results[0]
    const keys = await readKey(dataPaths.key)

    if (!keys) fail()

    keys.forEach((key) => {
      result.compile(key, 3, 1)
    })

    console.log(result)

    expect(result.totalMarks).toBeGreaterThan(0)

    const isCompiled =
      result.correctCount ||
      result.incorrectCount ||
      result.unattemptedCount ||
      result.skippedCount

    expect(isCompiled).toBeGreaterThan(0)
  })

  test('should be able to identify key and result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.results[0]
    const keys = await readKey(dataPaths.key)

    expect(result.isKey()).toBeFalsy()

    if (keys) {
      const key = keys[0]
      expect(key.isKey()).toBeTruthy()
    }
  })

  test('should be able to calculate marks for compiled result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.results[0]
    const keys = await readKey(dataPaths.key)

    if (keys) {
      result.compile(keys[0]).setMarks(3, 1)
      expect(result.totalMarks).not.toBe(0)
    }
  })
})

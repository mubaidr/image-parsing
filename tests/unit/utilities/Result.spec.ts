import { CompiledResult } from '@/utilities/CompiledResult'
import { dataPaths } from '@/utilities/dataPaths'
import { readKey } from '@/utilities/readKey'
import { Result } from '@/utilities/Result'
import path from 'path'

describe('Result', () => {
  test('should be defined', () => {
    const result = new Result()

    expect(result).toBeDefined()
  })

  test('should have defaults set', async () => {
    const rollNo = '10023'
    const imageFile = path.resolve(dataPaths.imagesBarcode, '10023.jpg')
    const result = new Result(rollNo, imageFile)

    expect(result.id).toBeDefined()
    expect(result.rollNo).toBe(rollNo)
    expect(result.imageFile).toBe(imageFile)
  })

  test('should load from json', async () => {
    const o = {
      correctCount: 0,
      incorrectCount: 0,
      isCompiled: false,
      marks: 0,
      skippedCount: 0,
      totalMarks: 0,
      unattemptedCount: 0,
      id: '183b5aad-7122-4947-99e9-75c2f73cb076',
      imageFile:
        'D:\\Current\\image-parsing\\__tests__\\_data\\images-barcode\\10023.jpg',
      isRollNoExtracted: true,
      post: '',
      questionPaperType: '',
      rollNo: '10023',
      testCenter: '',
      testTime: '',
      q1: 'a',
      q2: 'b',
      q3: 'c',
      q4: 'd',
      q5: '?',
      q6: '*',
    }

    const result = Result.fromJson(o)

    expect(result).toMatchSnapshot()

    expect(result.id).toBeDefined()
    expect(result.rollNo).toBe(o.rollNo)
    expect(result.imageFile).toBe(o.imageFile)

    expect(result.answers['Q1'].value).toBe('A')
    expect(result.answers['Q2'].value).toBe('B')
    expect(result.answers['Q3'].value).toBe('C')
    expect(result.answers['Q4'].value).toBe('D')
    expect(result.answers['Q5'].value).toBe('?')
    expect(result.answers['Q6'].value).toBe('*')
  })

  test('should compile', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.getResults()[0]
    const keys = await readKey(dataPaths.key)

    if (!keys) return

    result.compile(keys[0], 3, 1)

    expect(result.getTotalMarks()).toBeGreaterThan(0)

    const isCompiled =
      result.getCorrectCount() ||
      result.getInCorrectCount() ||
      result.getUnattemptedCount() ||
      result.getSkippedCount() ||
      result.getSkippedCount()

    expect(isCompiled > 0).toBeTruthy()
  })

  test('should be able to identify key and result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.getResults()[0]
    const keys = await readKey(dataPaths.key)

    expect(result.isKey()).toBeFalsy()
    expect(result.isResult()).toBeTruthy()

    if (keys) {
      const key = keys[0]
      expect(key.isKey()).toBeTruthy()
      expect(key.isResult()).toBeFalsy()
    }
  })

  test('should be able to match key with result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.getResults()[0]
    const keys = await readKey(dataPaths.key)

    if (keys) {
      const key = keys[0]

      expect(result.matchWithKey(key)).toBeTruthy()

      key.post = '9999'

      expect(result.matchWithKey(key)).toBeFalsy()
    }
  })

  test('should be able to calculate marks for compiled result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.getResults()[0]
    const keys = await readKey(dataPaths.key)

    if (keys) {
      const key = keys[0]

      result.compile(key).setMarks(3, 1)

      expect(result.getTotalMarks()).not.toBe(0)
    }
  })

  test('should be able to export to json object', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.result)
    const result = compiledResult.getResults().reverse()[0]

    expect(result.hasValidRollNo()).toBeTruthy()
    expect(result.hasImageFile()).toBeTruthy()

    const o = result.toJson()

    expect(o).toMatchSnapshot()
  })
})

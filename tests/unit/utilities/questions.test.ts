import CompiledResult from '../../src/utilities/@classes/CompiledResult'
import { dataPaths } from '../../src/utilities/dataPaths'
import { getDesignData } from '../../src/utilities/design'
import { getSharpObjectFromSource } from '../../src/utilities/images'
import { getQuestionsData } from '../../src/utilities/questions'

describe('getQuestionsData', () => {
  test('should be defined', async () => {
    expect(getQuestionsData).toBeInstanceOf(Function)
  })

  test('should return json for new data', async () => {
    const design = getDesignData(dataPaths.designBarcode)
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const qd = await getQuestionsData(design, sharpImg)

    expect(qd.length).toBeGreaterThanOrEqual(60)
  })

  test('should return json for training data', async () => {
    const compiledResult = CompiledResult.loadFromExcel(dataPaths.key)
    const design = getDesignData(dataPaths.designBarcode)
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const qd = await getQuestionsData(design, sharpImg, compiledResult)

    expect(qd.length).toBeGreaterThanOrEqual(60)
  })
})

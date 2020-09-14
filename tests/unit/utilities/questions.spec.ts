import { dataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'
import { getSharpObjectFromSource } from '@/utilities/images'
import { getQuestionsData } from '@/utilities/questions'

describe('getQuestionsData', () => {
  test('should be defined', async () => {
    expect(getQuestionsData).toBeInstanceOf(Function)
  })

  test('should return json for new data', async () => {
    const design = await getDesignData(dataPaths.designBarcode)
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const qd = await getQuestionsData(design, sharpImg)

    expect(qd.length).toBeGreaterThanOrEqual(60)
  })
})

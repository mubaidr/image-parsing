import { dataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'
import { getSharpObjectFromSource } from '@/utilities/images'
import { getQuestionsData } from '@/utilities/questions'

jest.setTimeout(10000)

describe('getQuestionsData', () => {
  test('should return json for new data', async () => {
    const sharpImg = await getSharpObjectFromSource(dataPaths.keyImage)
    const design = await getDesignData(dataPaths.designBarcode)
    const qd = await getQuestionsData(design, sharpImg)

    expect(qd).toMatchSnapshot()
  })
})

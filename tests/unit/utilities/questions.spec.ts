import { DataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'
import { getImageDataFromSource } from '@/utilities/images'
import { getQuestionsData } from '@/utilities/questions'

jest.setTimeout(10000)

describe('getQuestionsData', () => {
  test('should return json for new data', async () => {
    const sharpImg = await getImageDataFromSource(DataPaths.keyImage)
    const design = await getDesignData(DataPaths.designBarcode)
    const qd = await getQuestionsData(design, sharpImg)

    expect(qd).toMatchSnapshot()
  })
})

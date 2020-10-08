import { dataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'

describe('getDesignData', () => {
  test('works', async () => {
    const designData = await getDesignData(dataPaths.designBarcode)

    expect(designData).toMatchSnapshot()
  })
})

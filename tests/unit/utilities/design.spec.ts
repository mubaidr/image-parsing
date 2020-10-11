import { DataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'

describe('getDesignData', () => {
  test('works', async () => {
    const designData = await getDesignData(DataPaths.designBarcode)

    expect(designData).toMatchSnapshot()
  })
})

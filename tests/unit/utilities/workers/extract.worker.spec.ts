import { dataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'
import { getImagePaths } from '@/utilities/images'
import { start } from '@/utilities/workers/extract.worker'

describe('workerExtract', () => {
  test('should be able to extract key just fine', async () => {
    const designData = await getDesignData(dataPaths.designBarcode)
    const results = await start(
      {
        designData,
        imagePaths: [dataPaths.keyImage],
      },
      false
    )

    expect(results).toBeDefined()
    expect(results?.length).toBe(1)
    // expect(results).toMatchSnapshot()
  })

  test('should be able to extract result just fine', async () => {
    const designData = await getDesignData(dataPaths.designBarcode)
    const imagePaths = await getImagePaths(dataPaths.imagesBarcode)

    const results = await start(
      {
        designData,
        imagePaths,
      },
      false
    )

    expect(results).toBeDefined()
    expect(results?.length).toBeGreaterThanOrEqual(3)
  })

  test('extracted result should match with results.xlsx', async () => {
    // read excel file
    // extract results
    // compare using file path (to  compare answer sheet without roll no)
  })
})

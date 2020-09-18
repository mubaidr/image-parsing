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

    if (!results) fail()

    expect(results.length).toBe(1)

    results.forEach((result) => {
      expect(result).toMatchSnapshot({
        id: expect.any(String),
        imageFile: expect.any(String),
      })
    })
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

    if (!results) fail()

    expect(results.length).toBe(4)
    // TODO: improve this test
    results.forEach((result) => {
      expect(result).toMatchSnapshot({
        id: expect.any(String),
        imageFile: expect.any(String),
      })
    })
  })

  test('extracted result should match with results.xlsx', async () => {
    // read excel file
    // extract results
    // compare using file path (to  compare answer sheet without roll no)
  })
})

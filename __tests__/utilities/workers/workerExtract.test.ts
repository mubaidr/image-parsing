import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'
import { getImagePaths } from '../../../src/utilities/images'
import workerExtract from '../../../src/utilities/workers/workerExtract'

describe('workerExtract', () => {
  test('should be able to extract result just fine', async () => {
    const designData = getDesignData(dataPaths.designBarcode)
    const imagePaths = await getImagePaths(dataPaths.imagesBarcode)

    const results = await workerExtract.start(
      {
        designData,
        imagePaths,
      },
      false,
    )

    const result = results ? results[0] : {}

    expect(result).toMatchSnapshot({
      id: expect.any(String),
    })
  })
})

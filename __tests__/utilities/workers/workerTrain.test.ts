import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'
import workerTrain from '../../../src/utilities/workers/workerTrain'

describe('workerTrain', () => {
  test('should train just fine', async () => {
    const designData = getDesignData(dataPaths.designBarcode)
    const resultPath = dataPaths.key
    const keyPath = dataPaths.keyImage

    const nnState = await workerTrain.start(
      {
        designData,
        resultPath,
        keyPath,
      },
      false,
    )

    if (nnState) {
      expect(nnState.error).toBeLessThanOrEqual(0.001)
    }
  })
})

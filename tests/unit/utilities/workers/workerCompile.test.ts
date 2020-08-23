import CompiledResult from '../../../src/utilities/@classes/CompiledResult'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getDesignData } from '../../../src/utilities/design'
import { readKey } from '../../../src/utilities/readKey'
import workerCompile from '../../../src/utilities/workers/workerCompile'

describe('workerCompile', () => {
  test('should compile just fine', async () => {
    const designData = getDesignData(dataPaths.designBarcode)
    const results = CompiledResult.loadFromExcel(dataPaths.result).getResults()
    const keys = await readKey(dataPaths.key)

    const compiledResult = workerCompile.start(
      {
        designData,
        results,
        keys,
      },
      false,
    )

    const result = compiledResult ? compiledResult.getResults()[0] : {}
    expect(result).toMatchSnapshot({
      id: expect.any(String),
      imageFile: expect.anything(),
    })
  })
})

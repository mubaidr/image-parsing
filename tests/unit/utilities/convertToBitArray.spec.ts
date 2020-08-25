import { convertToBitArray } from '../../../src/utilities/convertToBitArray'
import { dataPaths } from '../../../src/utilities/dataPaths'
import { getSharpObjectFromSource } from '../../../src/utilities/images'

describe('convertToBitArray', () => {
  test('should be able to convert to bit data array', async () => {
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)
    const { data, info } = await sharpImg
      .extract({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
      })
      .toBuffer({ resolveWithObject: true })

    const bitData = convertToBitArray(
      Array.prototype.slice.call(data, 0),
      info.channels,
    )

    expect(bitData.length).toBeGreaterThan(0)
    expect(bitData).toMatchSnapshot()
  })
})

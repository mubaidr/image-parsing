import { DataPaths } from '@/utilities/dataPaths'
import { Image } from '@/utilities/Image'
import * as path from 'path'

describe('Image', () => {
  test('load', async () => {
    const image = await Image.load(DataPaths.keyImage)

    expect(image.width).toBe(Image.TARGET_SIZE)
    expect(image.source).toBe(DataPaths.keyImage)
    expect(image.isNative).toBeTruthy()
    expect(image.data.length * image.width * image.height).toBeGreaterThan(0)
  })

  test('greyscale', async () => {
    const image = await Image.load(DataPaths.keyImage)

    const { width, height } = image

    image.greyscale()

    expect(image.width * image.height).toBe(width * height)
    expect(image.data.length * image.width * image.height).toBeGreaterThan(0)
  })

  test('extract', async () => {
    let image = await Image.load(
      path.resolve('./tests/_data/empty-200x400.png'),
      true
    )

    const width = 100
    const height = 200

    // 50, 100, 100, 200
    image = image.extract(width / 2, height / 2, width, height)

    expect(image.width * image.height).toBe(width * height)
    expect(image.data.length).toBe(width * height * 3)
  })
})

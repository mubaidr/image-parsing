import { DataPaths } from '@/utilities/dataPaths'
import { Image } from '@/utilities/Image'
import { existsSync } from 'fs'
import * as path from 'path'

describe('Image', () => {
  test('load', async () => {
    const image = await Image.load(DataPaths.keyImage)

    expect(image.width).toBe(Image.TARGET_SIZE)
    expect(image.source).toBe(DataPaths.keyImage)
    expect(image.isNative).toBeTruthy()
    expect(image.data.length * image.width * image.height).toBeGreaterThan(0)
  })

  test('grayscale', async () => {
    const image = await Image.load(DataPaths.keyImage)

    const { width, height } = image

    image.grayscale()

    expect(image.width * image.height).toBe(width * height)
    expect(image.data.length * image.width * image.height).toBeGreaterThan(0)
  })

  test('extract', async () => {
    const image = await Image.load(
      path.resolve('./tests/_data/empty-20x20.png')
    )

    const width = 10
    const height = 10

    // 5, 10, 10, 20
    const imageCopy = image.extract(width / 2, height / 2, width, height)

    imageCopy.log()

    expect(imageCopy.width * imageCopy.height).toBe(width * height)
    expect(imageCopy.data.length).toBe(width * height * 3)
    expect(imageCopy.data).toMatchSnapshot()
  })

  test('log', async () => {
    const image = await Image.load(
      path.resolve('./tests/_data/empty-20x20.png'),
      true
    )

    const width = 10
    const height = 10

    const imageCopy = image.extract(width / 2, height / 2, width, height)
    const target = await imageCopy.log()

    expect(existsSync(target)).toBeTruthy()
  })
})

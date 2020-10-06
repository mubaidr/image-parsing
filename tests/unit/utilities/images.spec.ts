import { dataPaths } from '@/utilities/dataPaths'
import {
  convertImage,
  getImagePaths,
  // eslint-disable-next-line prettier/prettier
  getSharpObjectFromSource
} from '@/utilities/images'
import fs from 'fs'
import path from 'path'
import Sharp from 'sharp'

describe('convertImage', () => {
  test('works', async () => {
    expect.assertions(2)

    const nativeImageSrc = path.resolve(dataPaths.imagesBarcode, '10023.jpg')
    const imageSrc = path.resolve(dataPaths.imagesBarcode, '10025.tif')

    expect(await convertImage(nativeImageSrc)).toEqual(nativeImageSrc)

    const convertedImgPath = await convertImage(imageSrc)

    expect(fs.existsSync(convertedImgPath)).toBeTruthy()

    fs.unlinkSync(convertedImgPath)
  })
})

describe('getImagePaths', () => {
  test('works', async () => {
    const paths = getImagePaths(dataPaths.imagesBarcode)

    paths.forEach((path) => {
      expect(fs.existsSync(path)).toBeTruthy()
    })
  })
})

describe('getSharpObjectFromSource', () => {
  test('works', async () => {
    const sharpImg = await getSharpObjectFromSource(dataPaths.keyImage)

    expect(sharpImg).toBeInstanceOf(Sharp)
  })
})

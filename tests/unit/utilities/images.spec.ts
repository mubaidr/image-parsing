import { dataPaths } from '@/utilities/dataPaths'
import {
  convertImage,
  getImagePaths,
  getSharpObjectFromSource,
  logImageData
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
    const paths = await getImagePaths(dataPaths.imagesBarcode)

    paths.forEach((path) => {
      expect(fs.existsSync(path)).toBeTruthy()
    })
  })
})

describe('getSharpObjectFromSource', () => {
  test('works', () => {
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)

    expect(sharpImg).toBeInstanceOf(Sharp)
  })
})

describe('logImageData', () => {
  test('works', async () => {
    const name = 'jest-test-img'
    const target = path.join(dataPaths.tmp, `${name}.jpg`)
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)

    await logImageData(sharpImg, name)

    expect(fs.existsSync(target)).toBeTruthy()

    fs.unlinkSync(target)

    await logImageData(dataPaths.keyImage, name)

    expect(fs.existsSync(target)).toBeTruthy()

    fs.unlinkSync(target)
  })
})

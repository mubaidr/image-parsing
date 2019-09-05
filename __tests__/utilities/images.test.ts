import fs from 'fs'
import path from 'path'
import Sharp from 'sharp'

import { dataPaths } from '../../src/utilities/dataPaths'
import {
  convertImage, getImagePaths, getSharpObjectFromSource, logImageData,
} from '../../src/utilities/images'

describe('convertImage', () => {
  test('defined', () => {
    expect(convertImage).toBeInstanceOf(Function)
  })

  test('works', async () => {
    expect.assertions(2)

    const nativeImageSrc = path.resolve(dataPaths.imagesBarcode, '10023.jpg')
    const imageSrc = path.resolve(dataPaths.imagesBarcode, '10025.tif')

    expect(await convertImage(nativeImageSrc)).toEqual(nativeImageSrc)
    expect(typeof (await convertImage(imageSrc))).toBe('string')
  })
})

describe('getImagePaths', () => {
  test('defined', () => {
    expect(getImagePaths).toBeInstanceOf(Function)
  })

  test('works', async () => {
    const paths = [
      'D:/Current/image-parsing/_test_data/images-barcode/10023.jpg',
      'D:/Current/image-parsing/_test_data/images-barcode/10025.tif',
      'D:/Current/image-parsing/_test_data/images-barcode/no-roll.jpg',
    ].map(item => item.toLowerCase())

    const output = (await getImagePaths(dataPaths.imagesBarcode)).map(item =>
      item.toLowerCase(),
    )

    expect(output).toEqual(paths)
  })
})

describe('getSharpObjectFromSource', () => {
  test('defined', () => {
    expect(getSharpObjectFromSource).toBeInstanceOf(Function)
  })

  test('works', () => {
    expect(getSharpObjectFromSource(dataPaths.keyImage)).toBeInstanceOf(Sharp)
  })
})

describe('logImageData', () => {
  test('defined', () => {
    expect(logImageData).toBeInstanceOf(Function)
  })

  test('works', () => {
    const name = 'jest-test-img'
    const target = path.join(dataPaths.tmp, `${name}.jpg`)
    const sharpImg = getSharpObjectFromSource(dataPaths.keyImage)

    logImageData(sharpImg, name)

    expect(fs.existsSync(target)).toBeTruthy()

    logImageData(dataPaths.keyImage, name)

    expect(fs.existsSync(target)).toBeTruthy()

    fs.unlinkSync(target)
  })
})

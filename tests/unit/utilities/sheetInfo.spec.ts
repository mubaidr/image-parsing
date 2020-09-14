import { dataPaths } from '@/utilities/dataPaths'
import { getDesignData } from '@/utilities/design'
import { getSharpObjectFromSource } from '@/utilities/images'
import { getRollNoFromImage } from '@/utilities/sheetInfo'
import path from 'path'

const designData = getDesignData(dataPaths.designBarcode)
const designDataQr = getDesignData(dataPaths.design)

describe('getRollNoFromImage', () => {
  test('should be working with barcode jpg', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.imagesBarcode, '10023.jpg')
    )
    const rollNo = await getRollNoFromImage(await designData, sharpImg)
    expect(rollNo).toBe('10023')
  })

  test('should be working with barcode tif', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.imagesBarcode, '10025.tif')
    )
    const rollNo = await getRollNoFromImage(await designData, sharpImg)
    expect(rollNo).toBe('10025')
  })

  test('should be working with qrcode jpg', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.images, '10023.jpg')
    )
    const rollNo = await getRollNoFromImage(await designDataQr, sharpImg)
    expect(rollNo).toBe('99A-10023-AAA-AAA-A')
  })

  test('should be working with qrcode tif', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.images, '10025.tif')
    )
    const rollNo = await getRollNoFromImage(await designDataQr, sharpImg)
    expect(rollNo).toBe('99A-10025-AAA-AAA-A')
  })

  test('should return undefined if not found jpg', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.imagesBarcode, 'no-roll.jpg')
    )
    const rollNo = await getRollNoFromImage(await designData, sharpImg)
    expect(rollNo).toBeUndefined()
  })

  test('should return undefined if not found if', async () => {
    const sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.images, 'no-roll.tif')
    )
    const rollNo = await getRollNoFromImage(await designDataQr, sharpImg)
    expect(rollNo).toBeUndefined()
  })
})

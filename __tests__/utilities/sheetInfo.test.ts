import path from 'path'

import { dataPaths } from '../../src/utilities/dataPaths'
import { getDesignData } from '../../src/utilities/design'
import { getSharpObjectFromSource } from '../../src/utilities/images'
import { getRollNoFromImage } from '../../src/utilities/sheetInfo'

describe('cache', () => {
  test('should be working with barcode', async () => {
    const designData = getDesignData(dataPaths.designBarcode)
    let sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.imagesBarcode, '10023.jpg'),
    )

    let rollNo = await getRollNoFromImage(designData, sharpImg, true)
    console.log(rollNo)

    sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.imagesBarcode, 'no-roll.jpg'),
    )

    rollNo = await getRollNoFromImage(designData, sharpImg, true)

    console.log(rollNo)
  })

  test('should be working with qrcode', async () => {
    const designDataQr = getDesignData(dataPaths.design)

    let sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.images, '10023-qr.jpg'),
    )

    let rollNo = await getRollNoFromImage(designDataQr, sharpImg, false)

    console.log(rollNo)

    sharpImg = getSharpObjectFromSource(
      path.join(dataPaths.images, 'no-roll-qr.tif'),
    )

    rollNo = await getRollNoFromImage(designDataQr, sharpImg, false)

    console.log(rollNo)
  })
})

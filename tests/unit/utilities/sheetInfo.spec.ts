// import path from 'path'
// import { dataPaths } from '@/utilities/dataPaths'
// import { getDesignData } from '@/utilities/design'
// import { getSharpObjectFromSource } from '@/utilities/images'
// import { getRollNoFromImage } from '@/utilities/sheetInfo'

describe("getRollNoFromImage", () => {
  test("should be working with barcode", async () => {
    //     const designData = getDesignData(dataPaths.designBarcode)
    //     let sharpImg = getSharpObjectFromSource(
    //       path.join(dataPaths.imagesBarcode, '10023.jpg'),
    //     )
    //     let rollNo = await getRollNoFromImage(designData, sharpImg)
    //     expect(rollNo).toBe('10023')
    //     sharpImg = getSharpObjectFromSource(
    //       path.join(dataPaths.imagesBarcode, 'no-roll.jpg'),
    //     )
    //     rollNo = await getRollNoFromImage(designData, sharpImg)
    //     expect(rollNo).toBeUndefined()
    //   })
    //   test('should be working with qrcode', async () => {
    //     const designDataQr = getDesignData(dataPaths.design)
    //     let sharpImg = getSharpObjectFromSource(
    //       path.join(dataPaths.images, '10023-qr.jpg'),
    //     )
    //     let rollNo = await getRollNoFromImage(designDataQr, sharpImg)
    //     expect(rollNo).toBe('99A-10023-AAA-AAA-A')
    //     sharpImg = getSharpObjectFromSource(
    //       path.join(dataPaths.images, 'no-roll-qr.tif'),
    //     )
    //     rollNo = await getRollNoFromImage(designDataQr, sharpImg)
    //     expect(rollNo).toBeUndefined()
  });
});

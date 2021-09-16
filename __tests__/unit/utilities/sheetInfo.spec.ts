import { DataPaths } from '@/utilities/dataPaths';
import { getDesignData } from '@/utilities/design';
import { Image } from '@/utilities/Image';
import { getSheetInfoFromImage } from '@/utilities/sheetInfo';
import path from 'path';

const designData = getDesignData(DataPaths.designBarcode);
const designDataQr = getDesignData(DataPaths.design);

describe('getRollNoFromImage', () => {
  test('should be working with barcode jpg', async () => {
    const image = await Image.load(
      path.join(DataPaths.imagesBarcode, '10023.jpg'),
    );
    const rollNo = await getSheetInfoFromImage(await designData, image);
    expect(rollNo).toBe('10023');
  });

  test('should be working with barcode tif', async () => {
    const image = await Image.load(
      path.join(DataPaths.imagesBarcode, '10025.tif'),
    );
    const rollNo = await getSheetInfoFromImage(await designData, image);
    expect(rollNo).toBe('10025');
  });

  test('should be working with qrcode jpg', async () => {
    const image = await Image.load(path.join(DataPaths.images, '10023.jpg'));
    const rollNo = await getSheetInfoFromImage(await designDataQr, image);
    expect(rollNo).toBe('99A-10023-AAA-AAA-A');
  });

  test('should be working with qrcode tif', async () => {
    const image = await Image.load(path.join(DataPaths.images, '10025.tif'));
    const rollNo = await getSheetInfoFromImage(await designDataQr, image);
    expect(rollNo).toBe('99A-10025-AAA-AAA-A');
  });

  test('should return undefined if not found jpg', async () => {
    const image = await Image.load(
      path.join(DataPaths.imagesBarcode, 'no-roll.jpg'),
    );
    const rollNo = await getSheetInfoFromImage(await designData, image);
    expect(rollNo).toBeUndefined();
  });

  test('should return undefined if not found tif', async () => {
    const image = await Image.load(path.join(DataPaths.images, 'no-roll.tif'));
    const rollNo = await getSheetInfoFromImage(await designDataQr, image);
    expect(rollNo).toBeUndefined();
  });
});

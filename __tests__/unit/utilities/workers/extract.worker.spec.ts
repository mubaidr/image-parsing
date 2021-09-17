import { DataPaths } from '/@/utilities/dataPaths';
import { getDesignData } from '/@/utilities/design';
import { Image } from '/@/utilities/Image';
import { readKey } from '/@/utilities/readKey';
import { start } from '/@/utilities/workers/extract.worker';

jest.setTimeout(10000);

describe('workerExtract', () => {
  test('should be able to extract key just fine', async () => {
    const designData = await getDesignData(DataPaths.designBarcode);
    const results = await start(
      {
        designData,
        imagePaths: [DataPaths.keyImage],
      },
      false,
    );

    if (!results) fail();

    expect(results.length).toBe(1);

    results.forEach((result) => {
      expect(result).toMatchSnapshot({
        id: expect.any(String),
        filePath: expect.any(String),
      });
    });
  });

  test('extracted result should match with results.xlsx', async () => {
    const resultsExcel = await readKey(DataPaths.result);
    const designData = await getDesignData(DataPaths.designBarcode);
    const imagePaths = Image.readDirectory(DataPaths.imagesBarcode);

    const results = await start(
      {
        designData,
        imagePaths,
      },
      false,
    );

    if (!results || !resultsExcel) fail();

    expect(results.length).toBe(4);

    results.forEach((result) => {
      resultsExcel.forEach((re) => {
        if (result.rollNo === re.rollNo) {
          expect(result.answers).toMatchObject(re.answers);
        }
      });

      expect(result).toMatchSnapshot({
        id: expect.any(String),
        filePath: expect.any(String),
      });
    });
  });
});

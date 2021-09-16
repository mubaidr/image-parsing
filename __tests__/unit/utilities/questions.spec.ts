import { DataPaths } from '@/utilities/dataPaths';
import { getDesignData } from '@/utilities/design';
import { Image } from '@/utilities/Image';
import { getQuestionsData } from '@/utilities/questions';

jest.setTimeout(10000);

describe('getQuestionsData', () => {
  test('should return json for new data', async () => {
    const image = await Image.load(DataPaths.keyImage);
    const design = await getDesignData(DataPaths.designBarcode);
    const qd = await getQuestionsData(design, image);

    expect(qd).toMatchSnapshot();
  });
});

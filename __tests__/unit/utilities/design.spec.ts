import { DataPaths } from '../../../packages/utilities/dataPaths';
import { getDesignData } from '../../../packages/utilities/design';

describe('getDesignData', () => {
  test('works with adjust offset', async () => {
    const designData = await getDesignData(DataPaths.designBarcode);

    expect(designData).toMatchSnapshot();
  });
});

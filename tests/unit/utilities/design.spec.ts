import { dataPaths } from "@/utilities/dataPaths";
import { getDesignData } from "@/utilities/design";

describe("getDesignData", () => {
  test("should be defined", () => {
    expect(getDesignData).toBeInstanceOf(Function);
  });

  test("works", () => {
    const designData = getDesignData(dataPaths.designBarcode);

    expect(designData).toMatchSnapshot();
  });
});

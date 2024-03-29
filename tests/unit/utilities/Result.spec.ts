import * as path from 'path';
import { CompiledResult } from '/@/utilities/compiledResult';
import { DataPaths } from '/@/utilities/dataPaths';
import { readKey } from '/@/utilities/readKey';
import { Result } from '/@/utilities/Result';

describe('Result', () => {
  test('should have defaults set', async () => {
    const rollNo = '10023';
    const imageFile = path.resolve(DataPaths.imagesBarcode, '10023.jpg');
    const result = new Result(rollNo, imageFile);

    expect(result.id).toBeDefined();
    expect(result.rollNo).toBe(rollNo);
    expect(result.filePath).toBe(imageFile);
  });

  test('should load from json', async () => {
    const o = {
      correctCount: 0,
      incorrectCount: 0,
      isCompiled: false,
      marks: 0,
      skippedCount: 0,
      totalMarks: 0,
      unattemptedCount: 0,
      id: '183b5aad-7122-4947-99e9-75c2f73cb076',
      filePath:
        'D:\\Current\\image-parsing\\__tests__\\_data\\images-barcode\\10023.jpg',
      isRollNoExtracted: true,
      post: '',
      questionPaperType: '',
      rollNo: '10023',
      testCenter: '',
      testTime: '',
      q1: 'a',
      q2: 'b',
      q3: 'c',
      q4: 'd',
      q5: '?',
      q6: '*',
    };

    const result = Result.fromJson(o);

    expect(result).toMatchSnapshot();
  });

  test('should be able to export to json object', async () => {
    const compiledResult = CompiledResult.loadFromExcel(DataPaths.result);
    const result = compiledResult.results[0];
    const o = result.toJson();

    expect(o).toMatchSnapshot();
  });

  test('should compile', async () => {
    const compiledResult = CompiledResult.loadFromExcel(DataPaths.result);
    const result = compiledResult.results[0];
    const keys = await readKey(DataPaths.key);

    if (!keys) fail();

    keys.forEach((key) => {
      result.compile(key, 3, 1);
    });

    expect(result.totalMarks).toBeGreaterThan(0);

    const isCompiled =
      result.correctCount ||
      result.incorrectCount ||
      result.unattemptedCount ||
      result.skippedCount;

    expect(isCompiled).toBeGreaterThan(0);
  });

  test('should be able to identify key and result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(DataPaths.result);
    const result = compiledResult.results[0];
    const keys = await readKey(DataPaths.key);

    expect(result.isKey()).toBeFalsy();

    if (keys) {
      const key = keys[0];
      expect(key.isKey()).toBeTruthy();
    }
  });

  test('should be able to calculate marks for compiled result', async () => {
    const compiledResult = CompiledResult.loadFromExcel(DataPaths.result);
    const result = compiledResult.results[0];
    const keys = await readKey(DataPaths.key);

    if (keys) {
      result.compile(keys[0], 3, 1);
      expect(result.totalMarks).not.toBe(0);
    }
  });
});

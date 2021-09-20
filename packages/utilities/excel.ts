/* eslint-disable @typescript-eslint/no-explicit-any */
import XLSX from 'xlsx';
import { CompiledResult } from './compiledResult';
import { toCamelCase, toHeadingCase } from './string';

const importExcelToJson = (src: string): any[] => {
  const workbook = XLSX.readFile(src);

  const arr: any[] = [];

  Object.values(workbook.Sheets).forEach((sheet) => {
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    });

    for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
      const row = rows[i];
      const keys = Object.keys(row);

      for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
        const key = keys[j];
        const newKey = toCamelCase(key);

        if (newKey === key) continue;

        row[newKey] = row[key];
        delete row[key];
      }
    }

    arr.push(...rows);
  });

  return arr;
};

function exportJsonToExcel(
  compiledResult: CompiledResult | any[],
  destination: string,
): void {
  const workbook = XLSX.utils.book_new();
  const rows =
    compiledResult instanceof CompiledResult
      ? compiledResult.export()
      : compiledResult;

  for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
    const row = rows[i];
    const keys = Object.keys(row);

    for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
      const key = keys[j];
      const newKey = toHeadingCase(key);

      if (newKey === key) continue;

      row[newKey] = row[key];
      delete row[key];
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet);
  XLSX.writeFile(workbook, destination);
}

// function exportHtmltoExcel(htmlTable: Element, destination: string): void {
//   const wb = XLSX.utils.table_to_book(htmlTable);
//   XLSX.writeFile(wb, destination);
// }

export { importExcelToJson, exportJsonToExcel };

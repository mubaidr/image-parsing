/**
 * @jest-environment jsdom
 */

import * as fs from 'fs';
import * as path from 'path';
import { CompiledResult } from '/@/utilities/compiledResult';
import { DataPaths } from '/@/utilities/dataPaths';
import { exportJsonToExcel, importExcelToJson } from '/@/utilities/excel';

// describe('exportHtmltoExcel', () => {
//   test('defined', () => {
//     expect(exportHtmltoExcel).toBeInstanceOf(Function);
//   });

//   test('works', () => {
//     document.body.innerHTML = `
//       <table id="customers">
//         <tbody><tr>
//           <th>Company</th>
//           <th>Contact</th>
//           <th>Country</th>
//         </tr>
//         <tr>
//           <td>Alfreds Futterkiste</td>
//           <td>Maria Anders</td>
//           <td>Germany</td>
//         </tr>
//         <tr>
//           <td>Centro comercial Moctezuma</td>
//           <td>Francisco Chang</td>
//           <td>Mexico</td>
//         </tr>
//         <tr>
//           <td>Ernst Handel</td>
//           <td>Roland Mendel</td>
//           <td>Austria</td>
//         </tr>
//         <tr>
//           <td>Island Trading</td>
//           <td>Helen Bennett</td>
//           <td>UK</td>
//         </tr>
//         <tr>
//           <td>Laughing Bacchus Winecellars</td>
//           <td>Yoshi Tannamuri</td>
//           <td>Canada</td>
//         </tr>
//         <tr>
//           <td>Magazzini Alimentari Riuniti</td>
//           <td>Giovanni Rovelli</td>
//           <td>Italy</td>
//         </tr>
//       </tbody></table>`;

//     const table = document.getElementById('customers');
//     const target = path.resolve(DataPaths.tmp, Date.now().toString() + '.xlsx');

//     if (!table) return;

//     exportHtmltoExcel(table, target);
//     expect(fs.existsSync(target)).toBeTruthy();

//     fs.unlinkSync(target);
//   });
// });

describe('exportJsonToExcel', () => {
  test('defined', () => {
    expect(exportJsonToExcel).toBeInstanceOf(Function);
  });

  test('works', () => {
    const compiledResult = CompiledResult.loadFromExcel(
      DataPaths.resultCompiled,
    );
    const target = path.resolve(DataPaths.tmp, Date.now().toString() + '.xlsx');

    exportJsonToExcel(compiledResult, target);
    expect(fs.existsSync(target)).toBeTruthy();

    fs.unlinkSync(target);
  });
});

describe('importExcelToJson', () => {
  test('defined', () => {
    expect(importExcelToJson).toBeInstanceOf(Function);
  });

  test('works', () => {
    const json = importExcelToJson(DataPaths.result);

    expect(json).toMatchSnapshot();
  });
});

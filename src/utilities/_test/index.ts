import CompiledResult from '../@classes/CompiledResult'
// import { exportJsonToExcel } from '../excel'

const compiledResult = CompiledResult.loadFromExcel(
  './__tests__/test-data/result.xlsx'
)
  .addFromExcel('./__tests__/test-data/key.xlsx')
  .compile(3, 1)

// exportJsonToExcel(compiledResult, './.tmp/tmp.xlsx')

console
  .log
  // Result.fromJson(importExcelToJson('./__tests__/test-data/key.xlsx')[0])
  ()

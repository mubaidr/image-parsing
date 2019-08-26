import XLSX from 'xlsx'

import CompiledResult from './@classes/CompiledResult'
import { toCamelCase, toHeadingCase } from './string'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const importExcelToJson = (src: string): Record<string, any>[] => {
  const workbook = XLSX.readFile(src)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: Record<string, any>[] = []

  Object.values(workbook.Sheets).forEach(sheet => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    })

    for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
      const row = rows[i]
      const keys = Object.keys(row)

      for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
        const key = keys[j]
        const newKey = toCamelCase(key)

        if (newKey === key) continue

        row[newKey] = row[key]
        delete row[key]
      }
    }

    arr.push(...rows)
  })

  return arr
}

function exportJsonToExcel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compiledResult: CompiledResult | any[],
  destination: string
): void {
  const workbook = XLSX.utils.book_new()
  const rows =
    compiledResult instanceof CompiledResult
      ? compiledResult.export()
      : compiledResult

  for (let i = 0, rowsLength = rows.length; i < rowsLength; i += 1) {
    const row = rows[i]
    const keys = Object.keys(row)

    for (let j = 0, keysLength = keys.length; j < keysLength; j += 1) {
      const key = keys[j]
      const newKey = toHeadingCase(key)

      if (newKey === key) continue

      row[newKey] = row[key]
      delete row[key]
    }
  }

  const worksheet = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, destination)
}

function exportHtmltoExcel(htmlTable: string, destination: string): void {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

export { importExcelToJson, exportJsonToExcel, exportHtmltoExcel }

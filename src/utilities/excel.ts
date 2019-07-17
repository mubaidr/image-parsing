import XLSX from 'xlsx'
import CompiledResult from './@classes/CompiledResult'
import { toCamelCase, toHeadingCase } from './string'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const importExcelToJson = (src: string): any[] => {
  const workbook = XLSX.readFile(src)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: any[] = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const rows: {
      [key: string]: string | number
    }[] = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    })

    rows.forEach(row => {
      for (var key in row) {
        const value = row[key]

        delete row[key]
        row[toCamelCase(key)] = value
      }
    })

    arr.push(...rows)
  })

  return arr
}

const exportJsonToExcel = (
  compiledResult: CompiledResult,
  destination: string
) => {
  const workbook = XLSX.utils.book_new()
  const rows = compiledResult.export()

  rows.forEach(row => {
    for (var key in row) {
      row[toHeadingCase(key)] = row[key]
      delete row[key]
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, destination)
}

const exportHtmltoExcel = (htmlTable: string, destination: string) => {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

export { importExcelToJson, exportJsonToExcel, exportHtmltoExcel }

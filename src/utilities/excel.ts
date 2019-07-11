import XLSX from 'xlsx'
import CompiledResult from './@classes/CompiledResult'
import { csvToJson } from './csvToJson'

const importExcelToJson = async (src: string): Promise<CompiledResult[]> => {
  const ext = src.split('.').pop()

  if (ext === 'csv') {
    return csvToJson(src, true)
  }

  const workbook = XLSX.readFile(src)
  const output: CompiledResult[] = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const json: CompiledResult[] = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    })

    output.push(...json)
  })

  return output
}

const exportHtmltoExcel = async (
  htmlTable: string,
  destination: string
): Promise<void> => {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

const exportJsonToExcel = async (
  results: CompiledResult[],
  destination: string
): Promise<void> => {
  const worksheet = XLSX.utils.json_to_sheet(results)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, destination)
}

export { exportHtmltoExcel, exportJsonToExcel, importExcelToJson }

import XLSX from 'xlsx'
import ICodeScan from './@interfaces/ICodeScan'
import { csvToJson } from './csvToJson'

type importExcelToJsonGetter = (src: string) => Promise<ICodeScan[]>

const importExcelToJson: importExcelToJsonGetter = async src => {
  const ext = src.split('.').pop()

  if (ext === 'csv') {
    return csvToJson(src, true)
  }

  const workbook = XLSX.readFile(src)
  const output: ICodeScan[] = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const json: ICodeScan[] = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    })

    output.push(...json)
  })

  return output
}

type exportHtmlToExcelGetter = (
  htmlTable: string,
  destination: string
) => Promise<void>

const exportHtmltoExcel: exportHtmlToExcelGetter = async (
  htmlTable,
  destination
) => {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

type exportJsonToExcelGetter = (
  results: ICodeScan[],
  destination: string
) => Promise<void>

const exportJsonToExcel: exportJsonToExcelGetter = async (
  results,
  destination
) => {
  const worksheet = XLSX.utils.json_to_sheet(results)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, destination)
}

export { exportHtmltoExcel, exportJsonToExcel, importExcelToJson }

import XLSX from 'xlsx'
import CompiledResult from './@classes/CompiledResult'
import Result from './@classes/Result'

const csvToJson = async (csv: string, isPath: boolean): Promise<Result[]> => {
  const list: Result = []

  console.log(csv, isPath)
  throw 'Not Implemented'

  return list

  /*
  const csvTool = csvtojson({
    flatKeys: true,
  })

  if (isPath) {
    return csvTool.fromFile(csv)
  }

  return csvTool.fromString(csv)
  */
}

const importExcelToJson = async (src: string): Promise<Result[]> => {
  const ext = src.split('.').pop()

  if (ext === 'csv') {
    return csvToJson(src, true)
  }

  const workbook = XLSX.readFile(src)
  const output: Result[] = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const json: Result[] = XLSX.utils.sheet_to_json(sheet, {
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
  results: CompiledResult,
  destination: string
): Promise<void> => {
  const worksheet = XLSX.utils.json_to_sheet(results.toJson())
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, destination)
}

export { csvToJson, exportHtmltoExcel, exportJsonToExcel, importExcelToJson }

import XLSX from 'xlsx'
import CompiledResult from './@classes/CompiledResult'

const importExcelToJson = (src: string): any[] => {
  const workbook = XLSX.readFile(src)
  const arr: any[] = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]

    arr.push(
      XLSX.utils.sheet_to_json(sheet, {
        blankrows: false,
        raw: true,
      })
    )
  })

  return arr
}

const exportJsonToExcel = (
  compiledResults: CompiledResult[],
  destination: string
) => {
  const workbook = XLSX.utils.book_new()

  compiledResults.forEach(compiledResult => {
    const worksheet = XLSX.utils.json_to_sheet(compiledResult.toJson())
    XLSX.utils.book_append_sheet(workbook, worksheet)
  })

  XLSX.writeFile(workbook, destination)
}

const exportHtmltoExcel = (htmlTable: string, destination: string) => {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

export { importExcelToJson, exportJsonToExcel, exportHtmltoExcel }

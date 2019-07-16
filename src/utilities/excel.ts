import XLSX from 'xlsx'
import CompiledResult from './@classes/CompiledResult'

const toCamelCase = (s: string): string => {
  return s.toLowerCase().replace(/([-_ ][a-z])/gi, $1 => {
    return $1
      .toUpperCase()
      .replace(' ', '')
      .replace('-', '')
      .replace('_', '')
  })
}

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

    arr.push(rows)
  })

  return arr
}

const exportJsonToExcel = (
  compiledResults: CompiledResult[],
  destination: string
) => {
  const workbook = XLSX.utils.book_new()

  compiledResults.forEach(compiledResult => {
    const worksheet = XLSX.utils.json_to_sheet(compiledResult.export())
    XLSX.utils.book_append_sheet(workbook, worksheet)
  })

  XLSX.writeFile(workbook, destination)
}

const exportHtmltoExcel = (htmlTable: string, destination: string) => {
  const wb = XLSX.utils.table_to_book(htmlTable)
  XLSX.writeFile(wb, destination)
}

export { importExcelToJson, exportJsonToExcel, exportHtmltoExcel }

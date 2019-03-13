const XLSX = require('xlsx')
const { CSVToJSON } = require('./csv')

async function importExcelToJSON(src) {
  const ext = src.split('.').pop()

  if (ext === 'csv') {
    return CSVToJSON(src, true)
  }

  const workbook = XLSX.readFile(src)
  const output = []

  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, {
      blankrows: false,
      raw: true,
    })

    output.push(...json)
  })

  return output
}

async function exportHTMLtoExcel(tbl, dest) {
  const wb = XLSX.utils.table_to_book(tbl)
  XLSX.writeFile(wb, dest)
}

async function exportJSONtoExcel(json, dest) {
  const worksheet = XLSX.utils.json_to_sheet(json)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet)
  XLSX.writeFile(workbook, dest)
}

module.exports = {
  importExcelToJSON,
  exportHTMLtoExcel,
  exportJSONtoExcel,
}

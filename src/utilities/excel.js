const XLSX = require('xlsx')

async function importExcelToJSON(src) {
  const json = XLSX.utils.sheet_to_json(src, {
    blankrows: false,
    header: 1,
  })
  return json
}

async function exportHTMLtoExcel(tbl, dest) {
  const wb = XLSX.utils.table_to_book(tbl)
  XLSX.writeFile(wb, dest)
}

module.exports = {
  importExcelToJSON,
  exportHTMLtoExcel,
}

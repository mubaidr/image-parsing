const XLSX = require('xlsx')

async function importExcelToJSON(src) {
  return {}
}

async function exportHTMLtoExcel(tbl, dest) {
  const wb = XLSX.utils.table_to_book(tbl)
  XLSX.writeFile(wb, dest)
}

module.exports = {
  importExcelToJSON,
  exportHTMLtoExcel,
}

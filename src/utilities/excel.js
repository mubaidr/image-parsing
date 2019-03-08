const XLSX = require('xlsx')

async function exportHTMLtoExcel(tbl, dest, name) {
  const wb = XLSX.utils.table_to_book(tbl, { sheet: name })
  // XLSX.writeFile(wb, {})
}

module.exports = {
  exportHTMLtoExcel,
}

const csvtojson = require('csvtojson')
const fs = require('fs')

/**
 *
 *
 * @param {String} str JSON object or JSON file path
 * @param {Boolean} isPath True for path
 * @param {Boolean} isKey True if the CSV file is answer key file
 * @returns {Object} CSV String
 */
async function CSVToJSON(str, isPath) {
  const csv = csvtojson({
    flatKeys: true,
  })
  let arr

  if (isPath) {
    arr = await csv.fromFile(str)
  } else {
    arr = await csv.fromString(str)
  }

  return arr
}

/**
 *
 *
 * @param {String} str JSON object or JSON file path
 * @param {Boolean} isPath True for path
 * @returns {Object} CSV String
 */
function JSONToCSV(str, isPath) {
  const obj = isPath ? JSON.parse(fs.readFileSync(str, 'utf8')) : str

  let header = 'ROLL NO'
  let csv = ''

  // sort by roll number
  obj.sort((a, b) => Object.keys(a)[0] - Object.keys(b)[0])

  // parse to csv
  Object.values(obj).forEach((val, index) => {
    const [[rollno, keys]] = Object.entries(val)

    csv += '\n'
    csv += rollno

    // sort by question no
    const keyEntries = Object.entries(keys).sort(
      (a, b) => a[0].replace('q', '') - b[0].replace('q', '')
    )

    // append to csv
    for (let i = 0; i < keyEntries.length; i += 1) {
      if (i !== keyEntries.length) {
        csv += ','
      }

      csv += keyEntries[i][1].toUpperCase
        ? keyEntries[i][1].toUpperCase()
        : keyEntries[i][1]

      if (index === 0) {
        header += `,${keyEntries[i][0].toUpperCase()}`
      }
    }
  })

  return `${header}${csv}`
}

module.exports = {
  JSONToCSV,
  CSVToJSON,
}

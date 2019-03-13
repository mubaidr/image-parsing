const csvtojson = require('csvtojson')

/**
 *
 *
 * @param {String} str JSON object or JSON file path
 * @param {Boolean} isPath True for path
 * @returns {Object} CSV String
 */
async function CSVToJSON(str, isPath) {
  const csv = csvtojson({
    flatKeys: true,
  })

  if (isPath) {
    return csv.fromFile(str)
  }

  return csv.fromString(str)
}

module.exports = {
  CSVToJSON,
}

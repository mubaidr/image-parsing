const { JSONToCSV } = require('./csv')

// eslint-disable-next-line
const { dialog, getCurrentWindow } = require('electron').remote

/**
 * Exports result data
 *
 * @param {Object} resultData Result data JSON format
 * @param {String} name Name of the output file
 * @param {Boolean} isCSV if the provided data is CSV
 */
async function exportResult(resultData, name, isCSV) {
  const csv = isCSV ? resultData : await JSONToCSV(resultData)

  dialog.showSaveDialog(getCurrentWindow(), {}, filename => {
    console.log(filename, csv)
    // TODO: write file
  })
}

/**
 * Compare the provided result with key to generate marks
 *
 * @param {Object} keys JSON Object containing answer keys
 * @param {Object} result JSON Object containing result keys
 * @param {Number} correctMarks Number of marks to assign per correct answer
 * @param {Number} negativeMarks Number of marks to deduct per correct answer
 * @returns {Number} Total marks obtained
 */
async function compileResult(keys, results, correctMarks, negativeMarks) {
  const keyEntries = Object.entries(keys.key)
  const output = []
  let totalMarks = 0

  for (let i = 0; i < keyEntries.length; i += 1) {
    const [, value] = keyEntries[i]

    if (value === '?' || value === '*') continue

    totalMarks += correctMarks
  }

  Object.entries(results).forEach(([rollNo, answers]) => {
    let marks = 0

    for (let i = 0; i < keyEntries.length; i += 1) {
      const [key, value] = keyEntries[i]

      // if user has not selected any option
      if (value === '?') continue

      // if question has multiple correct options
      if (value === '*') continue

      // if question has no right option
      if (answers[key] === '?') continue

      if (answers[key] === value) {
        // correct option
        marks += correctMarks
      } else {
        // in-correct option
        marks -= negativeMarks
      }
    }

    output.push({
      [rollNo]: {
        marks,
        totalMarks,
      },
    })
  })

  // export
  exportResult(await JSONToCSV(output), 'ResultMarks', true)
}

module.exports = {
  exportResult,
  compileResult,
}

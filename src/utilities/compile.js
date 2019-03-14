const { NATIVE_KEYS } = require('../utilities/valid-types')
const { importExcelToJSON } = require('../utilities/excel')
const { getDesignData } = require('./design')
const { processTask } = require('./processTaskWorker')
const dataPaths = require('./data-paths')

async function readResult(src) {
  return importExcelToJSON(src)
}

async function readKey(src) {
  const isNativeKey = NATIVE_KEYS.indexOf(src.split('.').pop()) !== -1

  if (isNativeKey) {
    return importExcelToJSON(src)
  }

  const designData = await getDesignData(dataPaths.DEFAULTS.design)
  const keyData = await processTask(designData, [src])

  return keyData
}

async function compileResult(resultPath, keyPath, options) {
  const compiledResult = []
  const [results, keys] = await Promise.all([
    readResult(resultPath),
    readKey(keyPath),
  ])

  // TODO support multiple keys in one file
  const key = keys[0]

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i]

    // skip processed result
    if (result.isProcessed) continue

    // compare with key
    let totalQuestions = 0
    let skippedQuestions = 0
    let skippedAnswers = 0
    let attemptedAnswers = 0
    let correctAnswers = 0
    let incorrectAnswers = 0

    const columns = Object.keys(key).filter(col => col[0].toLowerCase() === 'q')

    // total questions
    totalQuestions = columns.length

    for (let j = 0; j < columns.length; j += 1) {
      const column = columns[j]

      // question is skipped in key
      if (
        !key[column] ||
        ['?', '*', '', ' ', undefined, null, false, 0].indexOf(key[column]) >= 0
      ) {
        skippedQuestions += 1
        continue
      }

      // question is skipped by candidate
      if (result[column] === '?') {
        skippedAnswers += 1
        continue
      }

      // other questions are attempted
      attemptedAnswers += 1

      // check correct/incorrect options
      if (result[column] === key[column]) {
        correctAnswers += 1
      } else {
        incorrectAnswers += 1
      }
    }

    compiledResult.push({
      ...result,
      totalQuestions,
      skippedQuestions,
      skippedAnswers,
      attemptedAnswers,
      correctAnswers,
      incorrectAnswers,
      totalMarks: totalQuestions * options.correctMarks,
      obtainedMarks:
        correctAnswers * options.correctMarks -
        incorrectAnswers * options.incorrectMarks,
    })

    // update status of result to skip it for next iterations
    result.isProcessed = true
  }

  return compiledResult
}

module.exports = {
  compileResult,
}

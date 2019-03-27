import { VALIDTYPES } from '../utilities/validTypes'
import { DATAPATHS } from './dataPaths'

const { importExcelToJSON } = require('../utilities/excel')
const { getDesignData } = require('./design')
const { processTask } = require('./processTaskWorker')

interface IKEY {
  'Roll No': string
  'Roll#': string
  'Roll #': string
  'Roll Number': string
}

type ReadKeyGetter = (a: string) => Promise<IKEY[]>

const readKey: ReadKeyGetter = async src => {
  const ext = src.split('.').pop()

  if (ext === undefined) {
    return false
  }

  if (VALIDTYPES.NATIVE_KEYS.indexOf(ext) !== -1) {
    return importExcelToJSON(src)
  }

  const designData = await getDesignData(DATAPATHS.design)
  return processTask(designData, [src])
}

type CompileResultGetter = (a: string, b: string) => Promise<object>

// eslint-disable-next-line
const compileResult: CompileResultGetter = async (resultPath, keyPath) => {
  const [results, keys] = await Promise.all([
    importExcelToJSON(resultPath),
    readKey(keyPath),
  ])

  const compiledResults = []

  // TODO support multiple keys in one file
  const key = keys[0]

  for (let i = 0; i < results.length; i += 1) {
    const result = results[i]

    const compiledResult = {
      totalQuestions: 0,
      skippedQuestions: 0,
      skippedAnswers: 0,
      attemptedAnswers: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    }

    // skip processed result
    if (result.isProcessed) {
      continue
    }

    const columns = Object.keys(key).filter(col => col[0].toLowerCase() === 'q')

    for (let j = 0; j < columns.length; j += 1) {
      const column = columns[j]

      // question is skipped in key
      if (
        !key[column] ||
        ['?', '*', '', ' ', undefined, null, false, 0].indexOf(key[column]) >= 0
      ) {
        compiledResult.skippedQuestions += 1
        continue
      }

      // question is skipped by candidate
      if (result[column] === '?') {
        compiledResult.skippedAnswers += 1
        continue
      }

      // check correct/incorrect options
      if (result[column] === key[column]) {
        compiledResult.correctAnswers += 1
      } else {
        compiledResult.incorrectAnswers += 1
      }

      // other questions are attempted
      compiledResult.attemptedAnswers += 1
    }

    // total questions
    compiledResult.totalQuestions = columns.length

    // collect result
    compiledResults.push({ ...result, ...compiledResult })

    // update status of result to skip it for next iterations
    result.isProcessed = true
  }

  return compiledResults
}

module.exports = {
  compileResult,
}

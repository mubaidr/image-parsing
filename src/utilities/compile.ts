import { VALIDTYPES } from '../utilities/validTypes'
import { DATAPATHS } from './dataPaths'

import IKey from '../@interfaces/IKey'

import { importExcelToJson } from '../utilities/excel'
import { getDesignData } from './design'
import { processTask } from './processTaskWorker'

type ReadKeyGetter = (a: string) => Promise<IKey[]>

const readKey: ReadKeyGetter = async src => {
  const ext = src.split('.').pop()

  if (ext === undefined) {
    return false
  }

  if (VALIDTYPES.NATIVE_KEYS.indexOf(ext) !== -1) {
    return importExcelToJson(src)
  }

  const designData = await getDesignData(DATAPATHS.design)
  return processTask(designData, [src])
}

type CompileResultGetter = (a: string, b: string) => Promise<object>

const compileResult: CompileResultGetter = async (resultPath, keyPath) => {
  const [results, keys] = await Promise.all([
    importExcelToJson(resultPath),
    readKey(keyPath),
  ])

  const key = keys[0]
  const compiledResults = []
  const IS_PROCESSED: string[] = []

  for (const result of results) {
    // skip processed result
    if (IS_PROCESSED.indexOf(result.ROLL_NO)) {
      continue
    }

    const columns = Object.keys(key).filter(col => col[0].toLowerCase() === 'q')
    const compiledResult = {
      attemptedAnswers: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      skippedQuestions: 0,
      totalQuestions: 0,
    }

    for (const column of columns) {
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
    IS_PROCESSED.push(result.ROLL_NO)
  }

  return compiledResults
}

module.exports = {
  compileResult,
}

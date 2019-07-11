import { importExcelToJson } from '../utilities/excel'
import CompiledResult from './@classes/CompiledResult'
import { KeyNativeEnum } from './@enums/ExtensionsEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { processTask } from './processTaskWorker'

const readKey = async (src: string): Promise<CompiledResult[] | void> => {
  const ext = src.split('.').pop()

  if (ext === undefined) {
    return
  }

  if (ext in KeyNativeEnum) {
    return importExcelToJson(src)
  }

  const designData = await getDesignData(dataPaths.design)
  return processTask(designData, [src])
}

const compileResult = async (
  resultPath: string,
  keyPath: string
): Promise<CompiledResult[]> => {
  const [results, keys] = await Promise.all([
    importExcelToJson(resultPath),
    readKey(keyPath),
  ])

  const key = keys && keys.length > 0 ? keys[0] : null
  if (!key) {
    throw new Error('Invalid key file.')
  }

  const compiledResults: CompiledResult[] = []
  const IS_PROCESSED: string[] = []

  for (const result of results) {
    // skip processed result
    if (result.rollNo) {
      if (IS_PROCESSED.includes(result.rollNo)) continue
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
    if (result.hasValidRollNo && result.rollNo) {
      IS_PROCESSED.push(result.rollNo)
    }
  }

  return compiledResults
}

export { compileResult }

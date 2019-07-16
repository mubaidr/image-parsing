import { importExcelToJson } from '../utilities/excel'
import CompiledResult from './@classes/CompiledResult'
import Result from './@classes/Result'
import { KeyNativeEnum } from './@enums/ExtensionsEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { processTask } from './processTaskWorker'

const readKey = async (src: string): Promise<Result[] | undefined> => {
  const ext = src.split('.').pop()

  if (ext === undefined) throw 'Invalid path specified'

  if (ext in KeyNativeEnum) return importExcelToJson(src)

  const designData = await getDesignData(dataPaths.design)
  return processTask(designData, [src])
}

const compileResult = async (
  resultPath: string,
  keyPath: string,
  marks: number,
  negativeMarks: number
): Promise<CompiledResult[]> => {
  const [results, key] = await Promise.all([
    importExcelToJson(resultPath),
    readKey(keyPath),
  ])

  const compiledResults = CompiledResult.fromExcel(resultPath)

  if (!key || key.length === 0) throw new Error('Invalid key file.')
  if (!results || results.length === 0) throw new Error('Invalid results file.')

  compiledResults.forEach(cr => {
    cr.addKeys(key).compile(marks, negativeMarks)
  })

  return compiledResults
}

export { compileResult }

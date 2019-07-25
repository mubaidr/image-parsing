import { importExcelToJson } from '../utilities/excel'
import CompiledResult from './@classes/CompiledResult'
import Result from './@classes/Result'
import { KeyNativeEnum } from './@enums/ExtensionsEnum'
import dataPaths from './dataPaths'
import { getDesignData } from './design'
import { processTask } from './processTaskWorker'

const readKey = async (src: string): Promise<Result[] | undefined> => {
  const ext = src.split('.').pop()

  if (ext === undefined) throw 'Invalid path specified'

  if (ext in KeyNativeEnum) {
    const results: Result[] = []

    importExcelToJson(src).forEach(row => {
      results.push(Result.fromJson(row))
    })

    return results
  }

  return processTask(await getDesignData(dataPaths.design), [src])
}

const compileResult = async (
  resultPath: string,
  keyPath: string,
  marks: number,
  negativeMarks: number
): Promise<CompiledResult> => {
  const keys = await readKey(keyPath)

  if (!keys || keys.length === 0) throw new Error('Invalid key file.')

  return CompiledResult.loadFromExcel(resultPath)
    .addKeys(keys)
    .compile(marks, negativeMarks)
}

export { compileResult }

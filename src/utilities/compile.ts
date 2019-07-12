import { importExcelToJson } from '../utilities/excel'
import CompiledResult from './@classes/CompiledResult'
import Result from './@classes/Result'
import { KeyNativeEnum } from './@enums/ExtensionsEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { processTask } from './processTaskWorker'

const readKey = async (src: string): Promise<Result[] | undefined> => {
  const ext = src.split('.').pop()

  if (ext === undefined) {
    throw 'Invalid path specified'
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
): Promise<CompiledResult> => {
  const [results, key] = await Promise.all([
    importExcelToJson(resultPath),
    readKey(keyPath),
  ])

  if (!key) {
    throw new Error('Invalid key file.')
  }

  const compiledResult = new CompiledResult()

  compiledResult.addKey(key[0])
  compiledResult.addResult(results)
  compiledResult.compile()

  return compiledResult
}

export { compileResult }

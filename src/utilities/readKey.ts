import Result from './@classes/Result'
import KeyNativeEnum from './@enums/KeyNativeEnum'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { importExcelToJson } from './excel'
import extractTask from './workers/workerExtract'

async function readKey(src: string): Promise<Result[] | undefined> {
  const ext = src.split('.').pop()
  if (ext === undefined) throw new Error('Invalid path specified')
  if (ext in KeyNativeEnum) {
    const rows = importExcelToJson(src)
    const results: Result[] = []
    for (let i = 0, len = rows.length; i < len; i += 1) {
      results.push(Result.fromJson(rows[i]))
    }
    return results
  }
  const designData = getDesignData(dataPaths.designBarcode)
  const keys = await extractTask.start(
    {
      designData,
      imagePaths: [src],
    },
    false
  )
  return keys
}
export { readKey }

import { DataPaths } from './dataPaths'
import { getDesignData } from './design'
import { importExcelToJson } from './excel'
import { Result } from './Result'
import { start as extractStart } from './workers/extract.worker'

export enum KeyNativeTypes {
  csv,
  xls,
  xlsm,
  xlsx,
}

export enum KeyTypes {
  bmp,
  csv,
  dib,
  gif,
  jfif,
  jpe,
  jpeg,
  jpg,
  png,
  svg,
  tif,
  tiff,
  webp,
  xls,
  xlsm,
  xlsx,
}

export async function readKey(src: string): Promise<Result[] | undefined> {
  const ext = src.split('.').pop()

  if (ext === undefined) throw new Error('Invalid path specified')

  if (ext in KeyNativeTypes) {
    const rows = importExcelToJson(src)
    const results: Result[] = []

    for (let i = 0, len = rows.length; i < len; i += 1) {
      results.push(Result.fromJson(rows[i]))
    }

    return results
  }

  const designData = await getDesignData(DataPaths.designBarcode)

  return extractStart(
    {
      designData,
      imagePaths: [src],
    },
    false
  )
}

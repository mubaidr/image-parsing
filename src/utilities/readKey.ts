import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { importExcelToJson } from './excel'
import { Result } from './Result'
import * as extractTask from './workers/extract.worker'

export enum KEY_NATIVE_TYPES {
  'csv' = 'csv',
  'xls' = 'xls',
  'xlsm' = 'xlsm',
  'xlsx' = 'xlsx',
}

export enum KEY_TYPES {
  'bmp' = 'bmp',
  'csv' = 'csv',
  'dib' = 'dib',
  'gif' = 'gif',
  'jfif' = 'jfif',
  'jpe' = 'jpe',
  'jpeg' = 'jpeg',
  'jpg' = 'jpg',
  'png' = 'png',
  'svg' = 'svg',
  'tif' = 'tif',
  'tiff' = 'tiff',
  'webp' = 'webp',
  'xls' = 'xls',
  'xlsm' = 'xlsm',
  'xlsx' = 'xlsx',
}

export async function readKey(src: string): Promise<Result[] | undefined> {
  const ext = src.split('.').pop()

  if (ext === undefined) throw new Error('Invalid path specified')

  if (ext in KEY_NATIVE_TYPES) {
    const rows = importExcelToJson(src)
    const results: Result[] = []
    for (let i = 0, len = rows.length; i < len; i += 1) {
      results.push(Result.fromJson(rows[i]))
    }
    return results
  }

  const designData = await getDesignData(dataPaths.designBarcode)

  return extractTask.start(
    {
      designData,
      imagePaths: [src],
    },
    false
  )
}

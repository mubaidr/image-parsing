import Result from './@classes/Result'
import { dataPaths } from './dataPaths'
import { getDesignData } from './design'
import { importExcelToJson } from './excel'
import * as extractTask from './workers/extract.worker'

export enum KeyNativeEnum {
  'csv' = 'csv',
  'xls' = 'xls',
  'xlsm' = 'xlsm',
  'xlsx' = 'xlsx',
}

export enum KeyTypesEnum {
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
  if (ext in KeyNativeEnum) {
    const rows = importExcelToJson(src)
    const results: Result[] = []
    for (let i = 0, len = rows.length; i < len; i += 1) {
      results.push(Result.fromJson(rows[i]))
    }
    return results
  }
  const designData = await getDesignData(dataPaths.designBarcode)
  const keys = await extractTask.start(
    {
      designData,
      imagePaths: [src],
    },
    false,
  )
  return keys
}

import fastGlob from 'fast-glob'
import { javascriptBarcodeReader } from 'javascript-barcode-reader'
import javascriptQRReader from 'jsqr'
import path from 'path'
import sharp, { Sharp } from 'sharp'
import uuid from 'uuid'

import ICache from '../@interfaces/ICache'
import ICodeScan from '../@interfaces/ICodeScan'
import IDesignData from '../@interfaces/IDesignData'
import { DATAPATHS } from './dataPaths'
import { IMAGES, NATIVE_IMAGES } from './validTypes'

const CACHE: ICache = {}

type getSharpObjectFromSourceGetter = (src: string) => Sharp

const getSharpObjectFromSource: getSharpObjectFromSourceGetter = src => {
  return sharp(src)
    .raw()
    .ensureAlpha()
}

type convertImageGetter = (src: string) => Promise<string>

const convertImage: convertImageGetter = async src => {
  if (!src) {
    throw new Error('Invalid source provided')
  }

  const ext = src.split('.').pop()

  if (!ext) {
    throw new Error('Invalid source provided')
  }

  // native supported images
  if (NATIVE_IMAGES.includes(ext)) {
    return src
  }

  // check cache
  const cached = CACHE[src]
  if (cached) {
    return cached
  }

  // generate random tmp url
  const url = path.join(DATAPATHS.tmp, `${uuid()}.jpg`)
  CACHE[src] = url

  // save file for preview
  await getSharpObjectFromSource(src).toFile(url)

  // returns new url
  return url
}

type logImageDataGetter = (src: string | Sharp, name?: string) => Promise<void>

const logImageData: logImageDataGetter = async (src, name) => {
  let img

  if (typeof src === 'string') {
    img = getSharpObjectFromSource(src)
  } else {
    img = src.clone()
  }

  img.jpeg().toFile(path.join(DATAPATHS.tmp, `${name || uuid()}.jpg`))
}

type getImagePathsGetter = (dir: string) => Promise<string[]>

const getImagePaths: getImagePathsGetter = async dir => {
  return fastGlob(`${dir}/*.{${IMAGES.join(',')}}`, { onlyFiles: true })
}

type getRollNoFromImageGetter = (
  designData: IDesignData,
  img: Sharp,
  isBarcode: boolean
) => Promise<ICodeScan>

const getRollNoFromImage: getRollNoFromImageGetter = async (
  designData,
  img,
  isBarcode
) => {
  const rollNoPos = designData.code
  const metadata = await img.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil((rollNoPos.x2 - rollNoPos.x1) * ratio)
  const height = Math.ceil((rollNoPos.y2 - rollNoPos.y1) * ratio)
  const obj: ICodeScan = {
    id: uuid(),
    center: '',
    time: '',
    post: '',
    type: '',
    rollNo: '',
    hasValidRollNo: false,
  }

  img.extract({
    left: Math.floor(rollNoPos.x1 * ratio),
    top: Math.floor(rollNoPos.y1 * ratio),
    width,
    height,
  })

  // debug image
  // logImageData(img)

  const data = await img.toBuffer()

  try {
    let rollNo: string

    if (isBarcode) {
      rollNo = await javascriptBarcodeReader(
        { data, width, height },
        { barcode: 'code-39' }
      )
    } else {
      // @ts-ignore
      rollNo = javascriptQRReader(data, width, height, {
        inversionAttempts: 'dontInvert',
      }).data
    }

    obj.rollNo = rollNo
    obj.hasValidRollNo = !!obj.rollNo
  } catch (err) {
    obj.rollNo = null
    obj.hasValidRollNo = false
  }

  return obj
}

export {
  convertImage,
  getImagePaths,
  logImageData,
  getRollNoFromImage,
  getSharpObjectFromSource,
}

import fastGlob from 'fast-glob'
import javascriptBarcodeReader from 'javascript-barcode-reader'
import javascriptQRReader from 'jsqr'
import path from 'path'
import sharp, { Sharp } from 'sharp'
import uuid from 'uuid'

import ImageNativeTypesEnum from './@enums/ImageNativeTypesEnum'
import ImageTypesEnum from './@enums/ImageTypesEnum'
import DesignData from './@interfaces/DesignData'
import { cache } from './cache'
import { dataPaths } from './dataPaths'

const getSharpObjectFromSource = (src: string): Sharp => {
  return (
    sharp(src)
      .raw()
      // .toColorspace('b-w')
      .removeAlpha()
  )
}

const convertImage = async (src: string): Promise<string> => {
  if (!src) {
    throw new Error('Invalid source provided')
  }

  const ext = src.split('.').pop()

  // native supported images
  if (ext && ext in ImageNativeTypesEnum) {
    return src
  }

  // check cache
  const cached = cache.get(src)
  if (cached) {
    return cached
  }

  // generate random tmp url
  const url = path.join(dataPaths.tmp, `${uuid()}.jpg`)
  cache.set(src, url)

  // save file for preview
  await getSharpObjectFromSource(src)
    .jpeg()
    .toFile(url)

  // returns new url
  return url
}

const logImageData = async (
  src: string | Sharp,
  name?: string
): Promise<void> => {
  let img

  if (typeof src === 'string') {
    img = getSharpObjectFromSource(src)
  } else {
    img = src.clone()
  }

  img.jpeg().toFile(path.join(dataPaths.tmp, `${name || uuid()}.jpg`))
}

const getImagePaths = async (dir: string): Promise<string[]> => {
  const loc = dir.replace(/\\/gi, '/')
  const exts = Object.keys(ImageTypesEnum)

  return fastGlob(`${loc}/*.{${exts}}`, {
    onlyFiles: true,
  })
}

const getRollNoFromImage = async (
  designData: DesignData,
  img: Sharp,
  isBarcode: boolean
): Promise<string | undefined> => {
  const rollNumberCoordinates = designData.code
  const metadata = await img.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil(
    (rollNumberCoordinates.x2 - rollNumberCoordinates.x1) * ratio
  )
  const height = Math.ceil(
    (rollNumberCoordinates.y2 - rollNumberCoordinates.y1) * ratio
  )

  img.extract({
    left: Math.floor(rollNumberCoordinates.x1 * ratio),
    top: Math.floor(rollNumberCoordinates.y1 * ratio),
    width,
    height,
  })

  // log image
  // logImageData(img)

  const data = await img.toBuffer()
  let rollNo: string | undefined

  try {
    if (isBarcode) {
      rollNo = await javascriptBarcodeReader(
        { data, width, height },
        { barcode: 'code-39' }
      )
    } else {
      const res = javascriptQRReader(
        new Uint8ClampedArray(data),
        width,
        height,
        {
          inversionAttempts: 'dontInvert',
        }
      )

      rollNo = res ? res.data : undefined
    }
  } catch {
    rollNo = undefined
  }

  return rollNo
}

export { convertImage, getImagePaths, logImageData, getRollNoFromImage, getSharpObjectFromSource, }

import fastGlob from 'fast-glob'
import javascriptBarcodeReader from 'javascript-barcode-reader'
import javascriptQRReader from 'jsqr'
import path from 'path'
import sharp, { Sharp } from 'sharp'
import uuid from 'uuid'
import Cache from './@classes/Cache'
import ICodeScan from './@interfaces/ICodeScan'
import IDesignData from './@interfaces/IDesignData'
import { dataPaths } from './dataPaths'
import { Images, NativeImages } from './validTypes'

const CACHE = new Cache()

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

  if (!ext || !Images.includes(ext)) {
    throw new Error('Invalid source provided')
  }

  // native supported images
  if (NativeImages.includes(ext)) {
    return src
  }

  // check cache
  const cached = CACHE.get(src)
  if (cached) {
    return cached
  }

  // generate random tmp url
  const url = path.join(dataPaths.tmp, `${uuid()}.jpg`)
  CACHE.set(src, url)

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
  const exts = Images.join(',')
  const glob = `${loc}/*.{${exts}}`

  return fastGlob(glob, {
    onlyFiles: true,
  })
}

const getRollNoFromImage = async (
  designData: IDesignData,
  img: Sharp,
  isBarcode: boolean
): Promise<ICodeScan> => {
  const rollNumberCoordinates = designData.code
  const metadata = await img.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil(
    (rollNumberCoordinates.x2 - rollNumberCoordinates.x1) * ratio
  )
  const height = Math.ceil(
    (rollNumberCoordinates.y2 - rollNumberCoordinates.y1) * ratio
  )
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
    left: Math.floor(rollNumberCoordinates.x1 * ratio),
    top: Math.floor(rollNumberCoordinates.y1 * ratio),
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
      const res = javascriptQRReader(
        new Uint8ClampedArray(data),
        width,
        height,
        {
          inversionAttempts: 'dontInvert',
        }
      )

      if (res === null) throw 'QR Code not found!'

      rollNo = res.data
    }

    obj.rollNo = rollNo
    obj.hasValidRollNo = !!obj.rollNo
  } catch (err) {
    console.log(err)

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

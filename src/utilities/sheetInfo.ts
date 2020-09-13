import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  // eslint-disable-next-line prettier/prettier
  RGBLuminanceSource
} from '@zxing/library/esm5'
import jsqr from 'jsqr'
import { Sharp } from 'sharp'
import Tesseract from 'tesseract.js'
import { DesignData } from './workers/WorkerManager'

export async function getRollNoFromImage(
  designData: DesignData,
  image: Sharp
): Promise<string | undefined> {
  let rollNo: string | undefined
  const metadata = await image.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const imageClone = image.clone()

  image.extract({
    left: Math.floor(designData.code.x * ratio),
    top: Math.floor(designData.code.y * ratio),
    width: Math.ceil(designData.code.width * ratio),
    height: Math.ceil(designData.code.height * ratio),
  })

  if (designData.isQrCode) {
    const { data, info } = await image.ensureAlpha().toBuffer({
      resolveWithObject: true,
    })

    rollNo = jsqr(Uint8ClampedArray.from(data), info.width, info.height, {
      inversionAttempts: 'dontInvert',
    })?.data
  } else {
    const { data, info } = await image.greyscale().toBuffer({
      resolveWithObject: true,
    })

    const binaryBitmap = new BinaryBitmap(
      new HybridBinarizer(
        new RGBLuminanceSource(
          Uint8ClampedArray.from(data),
          info.width,
          info.height
        )
      )
    )
    const reader = new MultiFormatReader()
    const hints = new Map()
    const formats = [BarcodeFormat.CODE_39]

    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats)
    hints.set(DecodeHintType.PURE_BARCODE, true)
    reader.setHints(hints)

    try {
      rollNo = reader.decode(binaryBitmap).getText()
    } catch {
      rollNo = undefined
    }
  }

  if (!rollNo) {
    imageClone.extract({
      left: Math.floor(designData.rollNo.x * ratio),
      top: Math.floor(designData.rollNo.y * ratio),
      width: Math.ceil(designData.rollNo.width * ratio),
      height: Math.ceil(designData.rollNo.height * ratio),
    })

    const { data, info } = await imageClone.ensureAlpha().toBuffer({
      resolveWithObject: true,
    })

    try {
      const result = await Tesseract.recognize(data, 'eng')
      rollNo = result.data.text
    } catch {
      rollNo = undefined
    }
  }

  return rollNo
}

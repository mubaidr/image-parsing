import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  // eslint-disable-next-line prettier/prettier
  RGBLuminanceSource
} from '@zxing/library/esm5'
import { DesignData } from './design'
import { Image } from './Image'

// TODO: deploy a electorn webworker for BarcodeDecoder and TextDecoder
// TODO: get barcode/text from electron webworker through worker manager

function extractText(image: Image): string | undefined {
  return undefined
}

function decode(image: Image): string {
  const reader = new MultiFormatReader()

  const hints = new Map()
  hints.set(DecodeHintType.PURE_BARCODE, true)
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.QR_CODE,
  ])
  reader.setHints(hints)

  return reader
    .decode(
      new BinaryBitmap(
        new HybridBinarizer(
          new RGBLuminanceSource(image.data, image.width, image.height)
        )
      )
    )
    .getText()
}

export async function getSheetInfoFromImage(
  designData: DesignData,
  image: Image
): Promise<string | undefined> {
  let sheetInfo: string | undefined
  const ratio = image.width ? image.width / designData.width : 1

  const extracted = image.extract(
    Math.floor(designData.code.x * ratio),
    Math.floor(designData.code.y * ratio),
    Math.ceil(designData.code.width * ratio),
    Math.ceil(designData.code.height * ratio)
  )

  await extracted.log('roll-no-grayscaled')

  try {
    sheetInfo = decode(extracted)
  } catch (err) {
    console.log(err)
    sheetInfo = extractText(extracted)
  }

  // TODO: extract question paper, center, vacancy etc info from qrcode

  return sheetInfo
}

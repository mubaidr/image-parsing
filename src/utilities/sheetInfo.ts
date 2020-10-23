import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  // eslint-disable-next-line prettier/prettier
  RGBLuminanceSource
} from '@zxing/library'
import { DesignData } from './design'
import { Image } from './Image'

// TODO: deploy a electorn webworker for BarcodeDecoder and TextDecoder
// TODO: get barcode/text from electron webworker through worker manager

function extractText(image: Image): string | undefined {
  return undefined
}

function decode(image: Image): string {
  const hints = new Map()
  hints.set(DecodeHintType.TRY_HARDER, 1)
  hints.set(DecodeHintType.PURE_BARCODE, 1)
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.QR_CODE,
  ])

  const decode = new MultiFormatReader().decode(
    new BinaryBitmap(
      new HybridBinarizer(
        new RGBLuminanceSource(image.data, image.width, image.height)
      )
    ),
    hints
  )

  console.log('decode: ', decode)

  return decode.getText()
}

export async function getSheetInfoFromImage(
  designData: DesignData,
  image: Image
): Promise<string | undefined> {
  let sheetInfo: string | undefined
  const ratioX = image.width / designData.width
  const ratioY = image.height / designData.height

  const extracted = image.extract(
    Math.floor(designData.code.x * ratioX),
    Math.floor(designData.code.y * ratioY),
    Math.ceil(designData.code.width * ratioX),
    Math.ceil(designData.code.height * ratioY)
  )

  await extracted.log('roll-no-grayscaled')

  try {
    sheetInfo = decode(extracted)
  } catch (err) {
    console.error(err)
    sheetInfo = extractText(extracted)
  }

  // TODO: extract question paper, center, vacancy etc info from qrcode

  return sheetInfo
}

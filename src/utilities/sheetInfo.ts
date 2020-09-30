import {
  BarcodeFormat,
  BinaryBitmap,
  DecodeHintType,
  HybridBinarizer,
  MultiFormatReader,
  // eslint-disable-next-line prettier/prettier
  RGBLuminanceSource
} from '@zxing/library/esm5'
import { OutputInfo, Sharp } from 'sharp'
import { DesignData } from './design'

function extractText(data: Buffer, info: OutputInfo): string | undefined {
  // @ts-ignore
  if (TextDetector) {
    // @ts-ignore
    const textContents = new TextDetector().detect(
      new ImageData(Uint8ClampedArray.from(data), info.width, info.height)
    )

    console.log(textContents)
    // return textContents[0].rawValue
  }

  return undefined
}

function decode(data: Buffer, info: OutputInfo): string {
  // @ts-ignore
  console.log(BarcodeDetector)
  // @ts-ignore
  console.log(TextDetector)

  // @ts-ignore
  if (BarcodeDetector) {
    // @ts-ignore
    const barcodes = new BarcodeDetector({
      formats: ['code_39', 'qr_code'],
    }).detect(
      new ImageData(Uint8ClampedArray.from(data), info.width, info.height)
    )

    console.log(barcodes)

    if (barcodes.length === 0) throw 'Not found!'

    return barcodes[0].rawValue
  }

  const reader = new MultiFormatReader()
  const binaryBitmap = new BinaryBitmap(
    new HybridBinarizer(
      new RGBLuminanceSource(
        Uint8ClampedArray.from(data),
        info.width,
        info.height
      )
    )
  )

  const hints = new Map()
  hints.set(DecodeHintType.PURE_BARCODE, true)
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [
    BarcodeFormat.CODE_39,
    BarcodeFormat.QR_CODE,
  ])
  reader.setHints(hints)
  return reader.decode(binaryBitmap).getText()
}

export async function getSheetInfoFromImage(
  designData: DesignData,
  image: Sharp
): Promise<string | undefined> {
  let sheetInfo: string | undefined
  const metadata = await image.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1

  const { data, info } = await image
    .extract({
      left: Math.floor(designData.code.x * ratio),
      top: Math.floor(designData.code.y * ratio),
      width: Math.ceil(designData.code.width * ratio),
      height: Math.ceil(designData.code.height * ratio),
    })
    .greyscale()
    .toBuffer({
      resolveWithObject: true,
    })

  try {
    sheetInfo = decode(data, info)
  } catch (err) {
    console.error(err)
    sheetInfo = extractText(data, info)
  }

  // TODO: extract question paper, center, vacancy etc info from qrcode

  return sheetInfo
}

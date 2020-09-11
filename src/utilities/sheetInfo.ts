import jsqr from 'jsqr'
import { Sharp } from 'sharp'
import { DesignData } from './workers/WorkerManager'

export async function getRollNoFromImage(
  designData: DesignData,
  image: Sharp
): Promise<string | undefined> {
  let rollNo: string | undefined
  const metadata = await image.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const { data, info } = await image
    .extract({
      left: Math.floor(designData.code.x * ratio),
      top: Math.floor(designData.code.y * ratio),
      width: Math.ceil(designData.code.width * ratio),
      height: Math.ceil(designData.code.height * ratio),
    })
    .ensureAlpha()
    .toBuffer({
      resolveWithObject: true,
    })

  try {
    if (designData.isQrCode) {
      rollNo = jsqr(new Uint8ClampedArray(data), info.width, info.height, {
        inversionAttempts: 'dontInvert',
      })?.data
    } else {
      console.log('barcode only')
    }
  } catch (e) {
    console.error(e)

    //TODO: try to extract from written roll no using tesseract/opencv
  }

  return rollNo
}

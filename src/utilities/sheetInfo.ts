import javascriptBarcodeReader from 'javascript-barcode-reader'
import javascriptQRReader from 'jsqr'
import { Sharp } from 'sharp'

import DesignData from './@interfaces/DesignData'

// import { logImageData } from './images'

const getRollNoFromImage = async (
  designData: DesignData,
  img: Sharp,
  isBarcode: boolean,
): Promise<string | undefined> => {
  const codeLocation = designData.code
  const metadata = await img.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil(codeLocation.width * ratio)
  const height = Math.ceil(codeLocation.height * ratio)

  img
    .extract({
      left: Math.floor(codeLocation.x * ratio),
      top: Math.floor(codeLocation.y * ratio),
      width,
      height,
    })
    .median(3)

  // log image
  // logImageData(img)

  const data = await img.ensureAlpha().toBuffer()
  let rollNo: string | undefined

  try {
    if (isBarcode) {
      rollNo = await javascriptBarcodeReader(
        { data, width, height },
        { barcode: 'code-39' },
      )
    } else {
      const res = javascriptQRReader(
        new Uint8ClampedArray(data),
        width,
        height,
        {
          inversionAttempts: 'dontInvert',
        },
      )

      rollNo = res ? res.data : undefined
    }
  } catch {
    rollNo = undefined
  }

  return rollNo
}

export { getRollNoFromImage }

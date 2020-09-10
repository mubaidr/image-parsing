import QrScanner from 'qr-scanner'
import { Sharp } from 'sharp'
import { DesignData } from './workers/WorkerManager'

export async function getRollNoFromImage(
  designData: DesignData,
  image: Sharp
): Promise<string | undefined> {
  let rollNo: string | undefined
  const codeLocation = designData.code
  const metadata = await image.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil(codeLocation.width * ratio)
  const height = Math.ceil(codeLocation.height * ratio)
  const { data, info } = await image
    .extract({
      left: Math.floor(codeLocation.x * ratio),
      top: Math.floor(codeLocation.y * ratio),
      width,
      height,
    })
    .toBuffer({
      resolveWithObject: true,
    })

  try {
    if (designData.isQrCode) {
      rollNo = await QrScanner
        .scanImage
        // await createImageBitmap(
        //   new ImageData(new Uint8ClampedArray(data), info.width, info.height)
        // )
        ()
      console.log('rollNo', rollNo)
    } else {
      console.log('barcode scan')
    }
  } catch (e) {
    console.log('Failed!', e)
    rollNo = undefined
  }

  return rollNo
}

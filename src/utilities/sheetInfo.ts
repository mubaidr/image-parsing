import { Sharp } from 'sharp'
import { DesignData } from './@classes/WorkerManager'

const getRollNoFromImage = async (
  designData: DesignData,
  img: Sharp,
): Promise<string | undefined> => {
  const codeLocation = designData.code
  const metadata = await img.metadata()
  const ratio = metadata.width ? metadata.width / designData.width : 1
  const width = Math.ceil(codeLocation.width * ratio)
  const height = Math.ceil(codeLocation.height * ratio)

  img.extract({
    left: Math.floor(codeLocation.x * ratio),
    top: Math.floor(codeLocation.y * ratio),
    width,
    height,
  })

  const rollNo = '11111'

  // console.log(window.BarcodeScanner)

  return rollNo
}

export { getRollNoFromImage }

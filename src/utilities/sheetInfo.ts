import { Sharp } from 'sharp'
import DesignData from './@interfaces/DesignData'

// import { logImageData } from './images'

const getRollNoFromImage = async (
  designData: DesignData,
  img: Sharp,
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

  // const data = await img.ensureAlpha().toBuffer()
  const rollNo = '11111'

  return rollNo
}

export { getRollNoFromImage }

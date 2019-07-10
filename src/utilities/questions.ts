import sharp, { Sharp } from 'sharp'
import ICodeScan from './@interfaces/ICodeScan'
import IDesignData from './@interfaces/IDesignData'
import IQuestionData from './@interfaces/IQuestionData'
import { convertToBitArray } from './index'

const getQuestionsData = async (
  design: IDesignData,
  img: Sharp,
  results?: ICodeScan
): Promise<IQuestionData[]> => {
  const SCALE = 0.5
  const TARGET_WIDTH = Math.floor(design.width * SCALE)
  const TARGET_HEIGHT = Math.floor(design.height * SCALE)

  // resize if image is larger than design
  img.resize(TARGET_WIDTH, TARGET_HEIGHT, {
    fit: sharp.fit.inside,
    kernel: sharp.kernel.nearest,
  })

  const extractedQuestionData: IQuestionData[] = []

  for (const question of Object.entries(design.questions)) {
    const [title, q] = question

    img.extract({
      left: Math.floor(q.x1 * SCALE),
      top: Math.floor(q.y1 * SCALE),
      width: Math.ceil((q.x2 - q.x1) * SCALE),
      height: Math.ceil((q.y2 - q.y1) * SCALE),
    })

    // debug image
    // logImageData(img, title)

    const { data, info } = await img.toBuffer({ resolveWithObject: true })
    const binaryData = convertToBitArray([...data], info.channels)

    if (results) {
      if (results[title] !== '*') {
        // for training data
        extractedQuestionData.push({
          input: binaryData,
          output: { [results[title]]: 1 },
        })
      }
      continue
    }

    extractedQuestionData.push({ title, input: binaryData })
  }

  return extractedQuestionData
}

export { getQuestionsData }

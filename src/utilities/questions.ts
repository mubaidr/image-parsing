import sharp, { Sharp } from 'sharp'

import CompiledResult from './@classes/CompiledResult'
import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
import DesignData from './@interfaces/DesignData'
import QuestionData from './@interfaces/QuestionData'

// import { logImageData } from './images'
// import { convertToBitArray } from './index'

const getQuestionsData = async (
  design: DesignData,
  img: Sharp,
  compiledResult?: CompiledResult
): Promise<QuestionData[]> => {
  const scale = 0.5
  const targetWidth = Math.floor(design.width * scale)
  const targetHeight = Math.floor(design.height * scale)

  // resize if image is larger than design
  img.resize(targetWidth, targetHeight, {
    fit: sharp.fit.inside,
    kernel: sharp.kernel.nearest,
  })

  const extractedQuestionData: QuestionData[] = []
  const questions = Object.entries(design.questions)

  for (
    let i = 0, questionsLength = questions.length;
    i < questionsLength;
    i += 1
  ) {
    const [title, q] = questions[i]
    let titleLowerCase = title.toLowerCase()

    img
      .extract({
        left: Math.floor(q.x1 * scale),
        top: Math.floor(q.y1 * scale),
        width: Math.ceil((q.x2 - q.x1) * scale),
        height: Math.ceil((q.y2 - q.y1) * scale),
      })
      .toColourspace('b-w')

    // log image
    // logImageData(img, title)

    const { data } = await img.toBuffer({ resolveWithObject: true })

    if (compiledResult) {
      // for training purpose
      const result = compiledResult.getKeys()[0].answers

      if (result[titleLowerCase].value !== QuestionOptionsEnum.MULTIPLE) {
        extractedQuestionData.push({
          input: Array.prototype.slice.call(data, 0),
          output: { [result[titleLowerCase].value]: 1 },
        })
      }
    } else {
      extractedQuestionData.push({
        title,
        input: Array.prototype.slice.call(data, 0),
      })
    }
  }

  return extractedQuestionData
}

export { getQuestionsData }

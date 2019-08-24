import { Sharp } from 'sharp'

import CompiledResult from './@classes/CompiledResult'
import QuestionOptionsEnum from './@enums/QuestionOptionsEnum'
import DesignData from './@interfaces/DesignData'
import QuestionData from './@interfaces/QuestionData'
// import { logImageData } from './images'
import { convertToBitArray } from './index'

const getQuestionsData = async (
  design: DesignData,
  img: Sharp,
  compiledResult?: CompiledResult
): Promise<QuestionData[]> => {
  const { width } = await img.metadata()
  const scale = width && width > design.width ? design.width / width : 1
  const extractedQuestionData: QuestionData[] = []
  const questions = Object.entries(design.questions)

  if (scale !== 1) {
    img.resize(Math.floor(design.width * scale))
  }

  for (
    let i = 0, questionsLength = questions.length;
    i < questionsLength;
    i += 1
  ) {
    const [title, q] = questions[i]
    const titleLowerCase = title.toLowerCase()

    img.extract({
      left: Math.floor(q.x * scale),
      top: Math.floor(q.y * scale),
      width: Math.ceil(q.width * scale),
      height: Math.ceil(q.height * scale),
    })

    // log image
    // logImageData(img, title)

    const { data, info } = await img.toBuffer({ resolveWithObject: true })
    const bitData = convertToBitArray(
      Array.prototype.slice.call(data, 0),
      info.channels
    )

    if (compiledResult) {
      // for training purpose
      const result = compiledResult.getKeys()[0].answers

      if (result[titleLowerCase].value !== QuestionOptionsEnum.MULTIPLE) {
        extractedQuestionData.push({
          input: bitData,
          output: { [result[titleLowerCase].value]: 1 },
        })
      }
    } else {
      extractedQuestionData.push({
        title,
        input: bitData,
      })
    }
  }

  return extractedQuestionData
}

export { getQuestionsData }

import { Sharp } from 'sharp'
import { DesignData, QUESTION_OPTIONS } from './design'
// import { logImageData } from './images'

export type QuestionData = {
  [key: string]: {
    [key in QUESTION_OPTIONS]?: number[]
  }
}

export async function getQuestionsData(
  design: DesignData,
  sharpImage: Sharp
): Promise<QuestionData> {
  const { width } = await sharpImage.metadata()
  const scale = width && width > design.width ? design.width / width : 1
  const questions = Object.entries(design.questions)
  const questionsData: QuestionData = {}

  if (scale !== 1) sharpImage.resize(Math.ceil(design.width * scale))

  // TODO: adjust itemInfo(x,y) according to orientation info (squares position) from image

  for (let i = 0; i < questions.length; i += 1) {
    const [questionTitle, q] = questions[i]
    const options = Object.entries(q)

    for (let j = 0; j < options.length; j += 1) {
      const [optionTitle, itemInfo] = options[j]

      if (itemInfo === undefined) continue

      sharpImage.extract({
        left: Math.floor(itemInfo.x * scale),
        top: Math.floor(itemInfo.y * scale),
        width: Math.ceil(itemInfo.width * scale),
        height: Math.ceil(itemInfo.height * scale),
      })

      // log image
      // logImageData(sharpImage, questionTitle + optionTitle)

      const buffer = await sharpImage.toBuffer()

      if (questionsData[questionTitle] === undefined) {
        questionsData[questionTitle] = {}
      }

      questionsData[questionTitle][optionTitle as QUESTION_OPTIONS] = [
        ...buffer,
      ]
    }
  }

  return questionsData
}

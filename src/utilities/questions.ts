import { Sharp } from 'sharp'
import { DesignData } from './design'
import { QuestionOptions } from './QuestionOptions'

export type AnswerCollection = {
  title: QuestionOptions
  percentage: number
}

export type QuestionData = {
  [key: string]: QuestionOptions
}

function getPercentFilledFromBinary(data: number[]): number {
  const binaryData: number[] = []
  const channels = 3

  for (let i = 0; i < data.length; i += channels) {
    const threshold = 15
    const thresholdBlack = 80
    const [r, g, b] = data.slice(i, i + channels)
    const avg = Math.ceil((r + g + b) / channels)
    const upperLimit = avg + threshold
    const lowerLimit = avg - threshold

    if (avg <= thresholdBlack) {
      // Black pixel
      binaryData.push(1)
    } else if (
      r <= upperLimit &&
      r >= lowerLimit &&
      g <= upperLimit &&
      g >= lowerLimit &&
      b <= upperLimit &&
      b >= lowerLimit
    ) {
      // Grey pixel
      binaryData.push(0)
    } else {
      // Color pixel
      binaryData.push(1)
    }
  }

  const percentageBlack =
    binaryData.reduce((prev, item) => prev + item, 0) /
    (binaryData.length / 100)

  return percentageBlack
}

export async function getQuestionsData(
  design: DesignData,
  sharpImage: Sharp
): Promise<QuestionData> {
  const questions = Object.entries(design.questions)
  const questionData: QuestionData = {}
  const SCALE = 1

  sharpImage.resize(design.width * SCALE)

  // log image
  // logImageData(sharpImage, 'complete')

  for (let i = 0; i < questions.length; i += 1) {
    const [questionTitle, q] = questions[i]
    const options = Object.entries(q)
    const answerCollection: AnswerCollection[] = []
    let finalOption: QuestionOptions

    // collect % filled for all options
    for (let j = 0; j < options.length; j += 1) {
      const [optionTitle, itemInfo] = options[j]

      if (!itemInfo) continue

      sharpImage.extract({
        left: Math.floor((itemInfo.x - itemInfo.width * 0.5) * SCALE),
        top: Math.floor((itemInfo.y - itemInfo.height * 0.5) * SCALE),
        width: Math.ceil(itemInfo.width * SCALE),
        height: Math.ceil(itemInfo.height * SCALE),
      })

      // log image
      // logImageData(sharpImage, questionTitle + optionTitle)

      const percentBlack = getPercentFilledFromBinary([
        ...(await sharpImage.toBuffer()),
      ])

      answerCollection.push({
        title: optionTitle as QuestionOptions,
        percentage: percentBlack,
      })
    }

    // determine option by comparing % filled
    const [first, second] = answerCollection.sort((a, b) => {
      return b.percentage - a.percentage
    })

    if (first.percentage > 8 && first.percentage - second.percentage * 2 > 0) {
      finalOption = first.title
    } else if (first.percentage < 16) {
      finalOption = QuestionOptions.NONE
    } else {
      finalOption = QuestionOptions.MULTIPLE
    }

    questionData[questionTitle] = finalOption
  }

  return questionData
}
